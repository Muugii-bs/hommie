from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import replacers

# read Emotion-Lexicon.txt
with open("Emotion-Lexicon.txt", 'r') as emoleRaw:
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

# print("All Words: %s" % len(dic_emolex.keys()))

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


def mood(text, debug = False):
    words, words_stemmed = preprocessing(text, debug)
    emolex_dic = tweet_emolex(words, words_stemmed, debug)

    mood_dic_scores = {'anger': emolex_dic['anger'],
                       'fear': emolex_dic['fear'],
                       'sadness': emolex_dic['sadness'],
                       'happy': emolex_dic['joy']}

    if debug:
        print mood_dic_scores

    max_val = max(mood_dic_scores.values())

    if not max_val:
        return 'neutral'

    return max(mood_dic_scores.iterkeys(), key=lambda k: mood_dic_scores[k])
