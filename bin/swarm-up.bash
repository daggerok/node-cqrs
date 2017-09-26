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

# build message-frontend application image
docker build -f docker/message-frontend/Dockerfile -t 127.0.0.1:5000/message-frontend .

# build message-store application image
docker build -f docker/message-store/Dockerfile -t 127.0.0.1:5000/message-store .

# pull other images
docker-compose -f docker/docker-stack-deploy.yml build --force-rm --no-cache --pull

# push whole needed stack to local registry
docker-compose -f docker/docker-stack-deploy.yml push

# deploy stack as node-cqrs
docker stack deploy --compose-file docker/docker-stack-deploy.yml node-cqrs

# ls node-cqrs stack services
docker stack services node-cqrs

## `service scale --detach=false` available only from docker 17.07.0-ce

# scale no mongo service as is: 1
docker service scale --detach=false node-cqrs_mongo=1

# scale no rabbitmq service as is: 1
docker service scale --detach=false node-cqrs_rabbitmq=1

# scale down useless mongo-express
docker service scale node-cqrs_mongo-express=1

# scale no message-store service app as is: 1
docker service scale --detach=false node-cqrs_message-store=1

# scale up message-command service app up to 2
docker service scale --detach=false node-cqrs_message-command=2

# scale up message-frontend service app up to 3
docker service scale --detach=false node-cqrs_message-frontend=3

# show all node-cqrs stack services
docker stack services node-cqrs
