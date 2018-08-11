#### How to create virtual environment Windows

Run this simple command:

```bash
conda create -p ./venv python=3.5
conda activate ./venv
pip install -r requirement.txt
python create_db.py
python feed_db_with_flight_data.py
```



#### Create database

```sh
jantoth@ubuntu-ansible:~$ virtualenv -p python3.5 /opt/venv3
jantoth@ubuntu-ansible:~$ sudo chown -R jantoth.jantoth /opt/venv3
jantoth@ubuntu-ansible:~$ source /opt/venv3/bin/activate
(venv3) jantoth@ubuntu-ansible:/opt/venv3/2w$ cd /opt/venv3/2w
(venv3) jantoth@ubuntu-ansible:/opt/venv3/2w$ python create_db.py
```


#### Create auth.py file out of auth.py.model

```sh
vim  auth.py
login = {
    "password" : "...",
    "username" : "...",
    "url_token": "...",
    "url_list": "..."
}

```

#### Install sqlite3 if you do not already have it

```sh
(venv3) jantoth@ubuntu-ansible:/opt/venv3/bin$ sudo apt-get install sqlite
```

#### Insert first sample (created, json_data) entry and test

Insert first entry to database manually by running this command:

```sh
/opt/venv3/bin/python /opt/venv3/2w/feed_db_with_flight_data.py
```

Login to `sqlite` database from command line and check the entry

```sh
(venv3) jantoth@ubuntu-ansible:/opt/venv3/2w$ sqlite3 2w.sqlite
SQLite version 3.11.0 2016-02-15 17:29:24
Enter ".help" for usage hints.
sqlite>

# list tables in your database
sqlite> .tables
flight_data

# try to do following select
sqlite> select *  from flight_data;
1|2018-06-22 14:05:24.747339|{
    "data": {
        "flight": {
            "meta": {
                "dataset": {
...
...
```

#### Setup crontab for the first time

This is one time action when we do the deployment for the first time.
```sh
# ******************************************************************
#      - this command retrives data from API every 2 min
#      - saves data to sqlite database
#
# ******************************************************************
*/2 * * * *  /opt/venv3/bin/python /opt/venv3/2w/feed_db_with_flight_data.py >> /opt/venv3/2w/error_log.log 2>&1

```



#### Create index in Sqlite3

```sh
# gunicorn --bind 0.0.0.0:5000 --workers=3  wsgi:app -p flas_app.pid -D

(venv3) jantoth@ubuntu-ansible:/opt/venv3/tflask$ sqlite3 2w.sqlite
CREATE INDEX created_index_micka ON flight_data (created);

```