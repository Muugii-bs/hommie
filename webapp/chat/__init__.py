from gevent import monkey

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import flask.ext.login as flask_login

monkey.patch_all()

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/chat.db'
app.secret_key = 'Xji8NKizj7ZZYFRE5vpnKw/3BN/Nw0qwVjqAqHK6VjY='

db = SQLAlchemy(app)

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

import chat.views
import db_tools

def init_db():
    db_tools.drop_all_tables()
    db.create_all(app=app)
    db_tools.create_defaults(db)


if __name__ == '__main__':
    app.run()


from chat.models import User


@login_manager.user_loader
def load_user(userid):
    return User.query.get(int(userid))
