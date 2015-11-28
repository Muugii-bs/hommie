# Running server

```sh
$ virtualenv venv # create a virtual environment
$ source venv/bin/activate # activate the venv
(venv)$ pip install -r requirements.txt # install requirements inside the venv
(venv)$ python init_db.py # initialize the database
(venv)$ python run.py # run
```

Then open `localhost:5000` on your browser.
