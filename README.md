# Install necessary packages

```bash
yum install git vim wget curl gcc python3 python3-devel -y
```

## Clone project from github

```bash
# Project will be automatically cloned to "/opt/flights" directory
git clone https://github.com/xjantoth/flights.git /opt/flights
```

## Create or fill in conf/auth.py file

```bash
# Linux example
login = {
    "username" : "...",
    "password" : "...",
    "url_token": "...",
    "url_list": "...",
    "day_tamplate": "particular_day_navbar.tpl",
    "reg_template": "particular_day.tpl",
    "detail_list_view_tpl": "detail_list_view.tpl",
    "jumbo_tpl": "jumbo.tpl",
    "main_template": "main.tpl",
    "database_path": "/opt/2w.sqlite",
    "app_home": "/opt/flights"
}

#  Windows example
login = {
    "username" : "...",
    "password" : "...",
    "url_token": "...",
    "url_list": "...",
    "day_tamplate": "particular_day_navbar.tpl",
    "reg_template": "particular_day.tpl",
    "detail_list_view_tpl": "detail_list_view.tpl",
    "jumbo_tpl": "jumbo.tpl",
    "main_template": "main.tpl",
    "database_path": "C:\\users\\some-username\\flights\\2w.sqlite",
    "app_home": "C:\\users\\some-username\\flights"
}
```

## Export where you cloned project

```bash
# Export variables
FLIGHT_PATH=/opt/flights 
CRON=/var/spool/cron/root
```

## Create and activate Python 3 virtualenv

```bash
cd /opt && python3 -m venv venv3
source /opt/venv3/bin/activate
cd ${FLIGHT_PATH}
git checkout production
pip install -r requirement.txt
```


## Start flights app

```bash
cd ${FLIGHT_PATH} 
/opt/venv3/bin/python \
/opt/venv3/bin/gunicorn \
--bind 0.0.0.0:5000 \
--workers=3 \
wsgi:app \
-p flask_app.pid \
-D \
--error-logfile error.log
```

## Call app at port 5000 from browser or from cmd 

```bash
# This will create initial database in /opt/2w.sqlite
curl http://localhost:5000/ &>  /dev/null || :
```

## Create initial record in database

```bash
/opt/venv3/bin/python /opt/flights/feed_db_with_flight_data.py
```

## Create periodic cronjob to retrieve data from external source

```bash
CMD_PATH="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin"
JOB1="@reboot FLIGHT_PATH=/opt/flights cd $FLIGHT_PATH && /opt/venv3/bin/python /opt/venv3/bin/gunicorn --bind 0.0.0.0:5000 --workers=3 wsgi:app -p flask_app.pid -D --error-logfile error.log"
JOB2="*/5 * * * *  /opt/venv3/bin/python /opt/flights/feed_db_with_flight_data.py >> /opt/flights/error_log.log 2>&1"
echo "$CMD_PATH" >> $CRON
echo "$JOB1" >> $CRON
echo "$JOB2" >> $CRON
```

## Create index in SQLite

```bash
sqlite3 /opt/2w.sqlite "CREATE INDEX fast_search_index ON flight_data (created) exit"
```

## Clean database if necessary

```bash
Delete from DB
DELETE  FROM flight_data WHERE created <= '2018-08-01 17:56:02.523609';
vacuum;
```
