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
# old version
*/10 * * * *  cd /opt/venv3/tflask && /opt/venv3/bin/python /opt/venv3/tflask/feed_db_with_flight_data.py >> /opt/venv3/tflask/error_log.log 2>&1
@reboot  cd /opt/venv3/tflask && /opt/venv3/bin/python3.5 /opt/venv3/bin/gunicorn --bind 0.0.0.0:5000 --workers=3 wsgi:app -p flask_app.pid -D --error-logfile g_error_lofile.log


# frontend - backend version 
# m h  dom mon dow   command
0 1 * * * /usr/bin/certbot renew & > /dev/null
# frontend - backebd arch.
@reboot  su - deploy -c "cd /opt/serve/backend && /opt/serve/venv35/bin/python /opt/serve/venv35/bin/gunicorn --bind 127.0.0.1:4000 --workers=3 wsgi:app -p 2w_app.pid  -D --error-logfile gunicorn_error_lofile.log"
*/7 * * * * su - deploy -c "cd /opt/serve/backend && /opt/serve/venv35/bin/python /opt/serve/backend/feed_db_with_flight_data.py >> /opt/serve/backend/db_error_log.log 2>&1"

```



#### Create index in Sqlite3

```sh
# gunicorn --bind 0.0.0.0:5000 --workers=3  wsgi:app -p flas_app.pid -D

(venv3) jantoth@ubuntu-ansible:/opt/venv3/tflask$ sqlite3 2w.sqlite
CREATE INDEX created_index_micka ON flight_data (created);
CREATE INDEX fast_search_index ON flight_data (created);
```

#### Delete from DB

```bash
DELETE  FROM flight_data WHERE created <= '2018-08-01 17:56:02.523609';
vacuum;

```

#### Nginx
```bash
cat    /etc/nginx/sites-enabled/default
##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# http://wiki.nginx.org/Pitfalls
# http://wiki.nginx.org/QuickStart
# http://wiki.nginx.org/Configuration
#
# Generally, you will want to move this file somewhere, and start with a clean
# file but keep this around for reference. Or just disable in sites-enabled.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##



server {

        root /opt/serve/client/build;
        index index.html index.htm index.nginx-debian.html;

        server_name scaleway.linuxinuse.com;

        location / {
                try_files $uri /index.html;
        }
        location /api {
        proxy_pass http://127.0.0.1:4000;
        }

        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/scaleway.linuxinuse.com/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/scaleway.linuxinuse.com/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}




server {
    if ($host = scaleway.linuxinuse.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;

        server_name scaleway.linuxinuse.com;
    return 404; # managed by Certbot


}


```


### Add deploy user to docker group

```bash
usermod -aG docker deplo
```

