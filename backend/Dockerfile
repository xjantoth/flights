FROM python:3

ENV PYTHONUNBUFFERED 1

RUN apt-get update -y; apt-get install nginx supervisor -y && \
    mkdir -p /etc/supervisord /var/log/supervisord \
    /code /etc/letsencrypt/live/scaleway.linuxinuse.com/&& \
    rm /etc/nginx/sites-enabled/default && \
    sed -i '1idaemon off;' /etc/nginx/nginx.conf

WORKDIR /code
COPY nginx_backend_dockerized.conf /etc/nginx/sites-enabled/nginx_backend_dockerized.conf
COPY ["../client/build", "requirement_backend.txt", "start_gunicorn.sh", "twoflask.py", "wsgi.py", "/code/"]
COPY supervisord.conf /etc

RUN  pip install -r requirement_backend.txt && \
     chmod +x /code/start_gunicorn.sh

ENTRYPOINT ["/code/start_gunicorn.sh"]

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

#docker build -t "backend:latest" .
#docker run --name backend1 -d \
#      -v /opt/serve/2w.sqlite:/2w.sqlite:ro \
#      -v fullchain.pem:/etc/letsencrypt/live/scaleway.linuxinuse.com/fullchain.pem:ro \
#      -v privkey.pem:/etc/letsencrypt/live/scaleway.linuxinuse.com/privkey.pem:ro \
#      -v options-ssl-nginx.conf:/etc/letsencrypt/options-ssl-nginx.conf:ro \
#      -v ssl-dhparams.pem:/etc/letsencrypt/ssl-dhparams.pem:ro \
#      -p 4001:4000 \
#      -p 8077:8077 \
#      backend:latest



