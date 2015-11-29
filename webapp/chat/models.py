from flask import url_for
import flask.ext.login as flask_login
import json
from werkzeug import check_password_hash, generate_password_hash

from chat import db
from .utils import slugify

STRING_LEN = 100
INACTIVE = 0
ACTIVE = 1


class Family(db.Model):
    __tablename__ = 'family'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    slug = db.Column(db.String(STRING_LEN))
    admin_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    home_lat = db.Column(db.Float)
    home_long = db.Column(db.Float)

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return url_for('room', slug=self.slug)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        db.session.add(self)
        db.session.commit()


class User(db.Model, flask_login.UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(STRING_LEN), nullable=False)
    email = db.Column(db.String(STRING_LEN))
    status_code = db.Column(db.SmallInteger, default=INACTIVE)

    work_lat = db.Column(db.Float)
    work_long = db.Column(db.Float)

    _password = db.Column('password', db.String(STRING_LEN), nullable=False)
    def _get_password(self):
        return self._password

    def _set_password(self, password):
        self._password = generate_password_hash(password)
    # Hide password encryption by exposing password field only.
    password = db.synonym('_password',
                          descriptor=property(_get_password,
                                              _set_password))

    type_id = db.Column(db.Integer, db.ForeignKey('user_type.id'))
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'))

    def check_password(self, password):
        if self.password is None:
            return False
        return check_password_hash(self.password, password)

    @classmethod
    def authenticate(cls, email, password):
        user_login = cls.query.filter(User.email == email).first()

        if user_login:
            authenticated = user_login.check_password(password)
        else:
            authenticated = False

        return user_login, authenticated


class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(STRING_LEN), nullable=False)
    emotion = db.Column(db.Enum('angry', 'scared', 'sad', 'happy', 'normal'))
    timestamp = db.Column(db.DateTime)
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'))
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

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'value':  self.value,
            'sensor_id'  : self.sensor_id,
            'timestamp': json.dumps(self.timestamp.isoformat())
        }


class UserType(db.Model):
    __tablename__ = 'user_type'
    id = db.Column(db.Integer, primary_key=True)
    typename = db.Column(db.String(STRING_LEN), nullable=False)


class SensorType(db.Model):
    __tablename__ = 'sensor_type'
    id = db.Column(db.Integer, primary_key=True)
    typename = db.Column(db.String(STRING_LEN), nullable=False)
