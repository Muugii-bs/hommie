from flask import url_for

from chat import db
from .utils import slugify

class ChatRoom(db.Model):
    __tablename__ = 'chatrooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    slug = db.Column(db.String(50))
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
    name = db.Column(db.String(20), nullable=False)
    session = db.Column(db.String(20), nullable=False)
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatrooms.id'))

    def __unicode__(self):
        return self.name
