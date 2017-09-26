#!/usr/bin/env bash

# enable debug output
set -x

# init docker swarm cluster
docker swarm init

# create local registry
docker service create --detach=false --name registry --publish 5000:5000 registry:2

# build custom rabbitmq image
docker build -f docker/rabbitmq-healthcheck/Dockerfile -t 127.0.0.1:5000/rabbitmq-healthcheck .

# build message-command application image
docker build -f docker/message-command/Dockerfile -t 127.0.0.1:5000/message-command .

# pull other images
docker-compose -f docker/docker-compose-stack.yml build --force-rm --no-cache --pull

# push whole needed stack to local registry
docker-compose -f docker/docker-compose-stack.yml push

# deploy stack as node-cqrs
docker stack deploy --compose-file docker/docker-compose-stack.yml node-cqrs

# ls node-cqrs stack services
docker stack services node-cqrs

# stacke up message-command application
docker service scale --detach=false node-cqrs_message-command=3
docker stack services node-cqrs

# scale down useless mongo-epress for now
docker service scale --detach=false node-cqrs_mongo-express=0
docker stack services node-cqrs
