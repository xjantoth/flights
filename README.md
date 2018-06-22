#### Create python virtualenv if desired

```sh

virtualenv -p python3.5 /opt/venv3
. bin/activate
```


#### Create database

```sh
python create_db.py
```

#### Setup crontab for the first time

This is one time action when we do the deployment for the first time.
```sh
*/5 * * * *  python3.5 /opt/flask/feed_db_with_flight_data.py >> /opt/flask/error_log.log 2>&1
```



####