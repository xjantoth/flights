FROM python:3

ENV PYTHONUNBUFFERED 1

RUN apt-get update -y; apt-get install nginx supervisor -y && \
    mkdir -p /etc/supervisord /var/log/supervisord \
    /code /etc/letsencrypt/live/scaleway.linuxinuse.com/&& \
    rm /etc/nginx/sites-enabled/default && \
    sed -i '1idaemon off;' /etc/nginx/nginx.conf

WORKDIR /code
COPY nginx_backend_dockerized.conf /etc/nginx/sites-enabled/nginx_backend_dockerized.conf
#COPY ["build", "requirement_backend.txt", "start_gunicorn.sh", "twoflask.py", "wsgi.py", "/code/"]
COPY supervisord.conf /etc

RUN  pip install -r requirement_backend.txt && \
     chmod +x /code/start_gunicorn.sh

ENTRYPOINT ["/code/start_gunicorn.sh"]

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

#docker build -t "backend:latest" .
docker run --name backend1 -d \
      -v /opt/serve/2w.sqlite:/2w.sqlite:ro \
      -v /opt/serve/backend/ssl:/etc/letsencrypt/live/scaleway.linuxinuse.com \
      -v /opt/serve/backend/files:/etc/letsencrypt \
      -v /opt/serve/backend:/code
      -p 4001:4000 \
      -p 80:80 \
      -p 443:443   \
      backend:latest



