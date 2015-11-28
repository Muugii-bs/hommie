from gevent import monkey

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

monkey.patch_all()

app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/chat.db'
db = SQLAlchemy(app)

import chat.views
import db_tools


def init_db():
    db_tools.drop_all_tables()
    db.create_all(app=app)
    db_tools.create_defaults(db)


if __name__ == '__main__':
    app.run()
