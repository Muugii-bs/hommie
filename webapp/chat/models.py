from flask import url_for

from chat import db
from .utils import slugify

STRING_LEN = 100


class ChatRoom(db.Model):
    __tablename__ = 'chatrooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    slug = db.Column(db.String(STRING_LEN))
    users = db.relationship('ChatUser', backref='chatroom', lazy='dynamic')

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return url_for('room', slug=self.slug)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        db.session.add(self)
        db.session.commit()


class ChatUser(db.Model):
    __tablename__ = 'chatusers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    session = db.Column(db.String(STRING_LEN), nullable=False)
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatrooms.id'))

    def __unicode__(self):
        return self.name


class Family(db.Model):
    __tablename__ = 'family'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    slug = db.Column(db.String(STRING_LEN))
    admin_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return url_for('room', slug=self.slug)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        db.session.add(self)
        db.session.commit()


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    email = db.Column(db.String(STRING_LEN))
    type_id = db.Column(db.Integer, db.ForeignKey('user_type.id'))
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'))


class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_LEN), nullable=False)
    emotion = db.Column(db.Enum('anger', 'fear', 'sadness', 'happy', 'neutral'))
    timestamp = db.Column(db.DateTime)
    sender_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


class Sensor(db.Model):
    __tablename__ = 'sensor'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    type_id = db.Column(db.Integer, db.ForeignKey('sensor_type.id'))


class SensorValue(db.Model):
    __tablename__ = 'sensor_value'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(STRING_LEN), nullable=False)
    timestamp = db.Column(db.DateTime)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensor.id'))


class UserType(db.Model):
    __tablename__ = 'user_type'
    id = db.Column(db.Integer, primary_key=True)
    typename = db.Column(db.String(STRING_LEN), nullable=False)


class SensorType(db.Model):
    __tablename__ = 'sensor_type'
    id = db.Column(db.Integer, primary_key=True)
    typename = db.Column(db.String(STRING_LEN), nullable=False)
