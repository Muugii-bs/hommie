from flask_wtf import Form
from wtforms import PasswordField, SubmitField, TextField
from wtforms.validators import DataRequired

from chat.models import User


class LoginForm(Form):
    email = TextField(u'Email address', validators=[DataRequired()])
    password = PasswordField(u'Password', validators=[DataRequired()])
    submit = SubmitField(u'Sign in')
