from gevent import monkey

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

monkey.patch_all()

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/chat.db'
db = SQLAlchemy(app)

import chat.views


def init_db():
    db.create_all(app=app)


if __name__ == '__main__':
    app.run()
