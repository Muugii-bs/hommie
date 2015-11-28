# -*- coding:utf-8 -*-
import re
import unicodedata
from werkzeug.exceptions import NotFound
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
from nltk import FreqDist
import replacers
import os
from datetime import datetime
import codecs
import MeCab


### Constants
MECAB_MODE = 'mecabrc'
PARSE_TEXT_ENCODING = 'utf-8'


APP_ROOT = os.path.dirname(os.path.abspath(__file__))   # refers to application_top
APP_STATIC = os.path.join(APP_ROOT, 'static')


def slugify(value):
    value = unicodedata.normalize('NFKD', unicode(value)).encode('ascii', 'ignore')
    value = unicode(re.sub('[^\w\s-]', '', value).strip().lower())
    return re.sub('[-\s]+', '-', value)


def get_object_or_404(klass, **query):
    instance = klass.query.filter_by(**query).first()
    if not instance:
        raise NotFound()
    return instance


def get_or_create(klass, **kwargs):
    try:
        return get_object_or_404(klass, **kwargs), False
    except NotFound:
        instance = klass(**kwargs)
        instance.save()
        return instance, True


def get_current_time():
    return datetime.utcnow()


# read Emotion-Lexicon.txt
with open(os.path.join(APP_STATIC, "Emotion-Lexicon.txt"), 'r') as emoleRaw:
    emoleRaw = emoleRaw.readlines()


# create dic
dic_emolex = {}
dic_emolex_stemmed = {}

for line in emoleRaw:
    word, category, flag = line.split()
    flag = int(flag)

    if word not in dic_emolex:
        dic_emolex[word] = {}
        dic_emolex_stemmed[PorterStemmer().stem(word)] = {}

    dic_emolex[word][category] = flag
    dic_emolex_stemmed[PorterStemmer().stem(word)][category] = flag
    dic_emolex_stemmed[PorterStemmer().stem(word)]["_original_word"] = word

# read Japanese WordNet Affect
with open(os.path.join(APP_STATIC, "mood_jp.txt"), "r") as text_file:
    dic_wna_jp = {}
    lines = text_file.readlines()
    for line in lines:
        key, val = line.split()
        dic_wna_jp[key] = val


# sum of all words emotion-lexicon
def tweet_emolex(words, words_stemmed, debug = False):

    dic_tweet_emolex = {
        'anger': 0,
        'fear': 0,
        'disgust': 0,
        'sadness': 0,
        'surprise': 0,
        'trust': 0,
        'joy': 0,
        'anticipation': 0,
        'positive': 0,
        'negative': 0,
    }

    for i in range(len(words)):
        # search word on non-stemmed dictionary
        if words[i] in dic_emolex:
            if debug:
                print("w->d")
                print(words[i])
                print(dic_emolex[words[i]])

            for key in dic_tweet_emolex.keys():
                dic_tweet_emolex[key] += dic_emolex[words[i]][key]

        # search stemmed word on non-stemmed dictionary
        elif words_stemmed[i] in dic_emolex:
            if debug:
                print("sw->d")
                print(words[i])
                print(words_stemmed[i])
                print(dic_emolex[words_stemmed[i]])

            for key in dic_tweet_emolex.keys():
                dic_tweet_emolex[key] += dic_emolex[words_stemmed[i]][key]

        # search stemmed word on stemmed dictionary
        elif words_stemmed[i] in dic_emolex_stemmed:
            if debug:
                print("sw->sd")
                print(words[i])
                print(words_stemmed[i])
                print(dic_emolex_stemmed[words_stemmed[i]])

            for key in dic_tweet_emolex.keys():
                dic_tweet_emolex[key] += dic_emolex_stemmed[words_stemmed[i]][key]

    return dic_tweet_emolex


def preprocessing(text, debug = False):
    if debug:
        print text

    # lower case
    text = text.lower()
    if debug:
        print text

    # can't -> cannot, bya's -> bya is
    text = replacers.RegexpReplacer().replace(text)
    if debug:
        print text

    # word tokenize
    words = word_tokenize(text)
    if debug:
        print words

    # removing stopwords
    english_stops = set(stopwords.words('english'))
    english_stops_added = english_stops | {'.', ',', ':', ';'}
    words = [word for word in words if word not in english_stops_added]
    if debug:
        print words

    # stemming words
    stemmer = PorterStemmer()
    words_stemmed = list(map(lambda word: stemmer.stem(word), words))
    if debug:
        print words_stemmed

    return words, words_stemmed


def mood_eng(text, debug = False):
    words, words_stemmed = preprocessing(text, debug)
    emolex_dic = tweet_emolex(words, words_stemmed, debug)

    mood_dic_scores = {'angry': emolex_dic['anger'],
                       'scared': emolex_dic['fear'],
                       'sad': emolex_dic['sadness'],
                       'happy': emolex_dic['joy']}

    if debug:
        print mood_dic_scores

    max_val = max(mood_dic_scores.values())

    if not max_val:
        return 'normal'

    return max(mood_dic_scores.iterkeys(), key=lambda k: mood_dic_scores[k])


def mood(unicode_string, debug = False):
    tagger = MeCab.Tagger(MECAB_MODE)
    unicode_string = unicode(unicode_string, "utf-8")
    text = unicode_string.encode(PARSE_TEXT_ENCODING)
    node = tagger.parseToNode(text)
    node = node.next
    words_dic = {}
    while node:
        word = node.surface.decode("utf-8")
        root = node.feature.split(",")[6]
        if root in dic_wna_jp:
            words_dic[root] = dic_wna_jp[root]
        else:
            words_dic[word] = mood_eng(word)
        node = node.next

    if debug:
        for key in words_dic.keys():
            print key, ": ", words_dic[key]

    values = [val for val in words_dic.values() if val != 'normal']

    if not len(values):
        return 'normal'

    ans = FreqDist(values).max()

    if ans == "anger":
        return "angry"

    if ans != "ambiguous":
        return ans
