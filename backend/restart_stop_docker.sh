#!/usr/bin/env bash
set -e

DOCKER_NAME=backend1
DATABASE_FILE=2w.sqlite
DEPLOY_PATH_BACKEND="/opt/serve/backend"
DOCKER_IMAGE="backend:latest"


function stop_docker {
    echo "executing: docker stop ${DOCKER_NAME} ..."
    docker stop ${DOCKER_NAME}
    CONTAINER_ID=$(docker ps -aqf "name=${DOCKER_NAME}")
    echo "executing: docker rm -f ${CONTAINER_ID} ..."
    docker rm -f ${CONTAINER_ID}
}


function start_docker {
    echo -e "Starting Docker image:
docker run --name ${DOCKER_NAME} -d \
  -v /opt/serve/${DATABASE_FILE}:/${DATABASE_FILE}:ro \
  -v /opt/serve/backend/ssl:/etc/letsencrypt/live/scaleway.linuxinuse.com \
  -v /opt/serve/backend/files:/etc/letsencrypt \
  -v /opt/serve/backend:/code \
  --net=host \
  ${DOCKER_IMAGE}"

    docker run --name ${DOCKER_NAME} -d \
          -v /opt/serve/${DATABASE_FILE}:/${DATABASE_FILE}:ro \
          -v /opt/serve/backend/ssl:/etc/letsencrypt/live/scaleway.linuxinuse.com \
          -v /opt/serve/backend/files:/etc/letsencrypt \
          -v /opt/serve/backend:/code \
          --net=host \
          ${DOCKER_IMAGE}
     if [ $? -eq 0 ]
        then
            echo "Docker --name ${DOCKER_NAME} successfully created."
        else
            echo "Could not start --name ${DOCKER_NAME} " >&2
        fi
}

echo "Executing stop_docker function"
stop_docker
echo "Executing start_docker function"
start_docker