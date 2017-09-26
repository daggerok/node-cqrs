#!/usr/bin/env bash
set -x

docker swarm init
docker service create --detach=false --name registry --publish 5000:5000 registry:2

docker build -f docker/rabbitmq-healthcheck/Dockerfile -t 127.0.0.1:5000/rabbitmq-healthcheck .
docker build -f docker/message-command/Dockerfile -t 127.0.0.1:5000/message-command .
docker build -f docker/message-frontend/Dockerfile -t 127.0.0.1:5000/message-frontend .

docker-compose -f docker/docker-stack-deploy.yml build --pull
docker-compose -f docker/docker-stack-deploy.yml push

docker stack deploy --compose-file docker/docker-stack-deploy.yml node-cqrs
docker stack services node-cqrs

docker service scale node-cqrs_mongo-express=1
docker service scale --detach=false node-cqrs_mongo=1
docker service scale --detach=false node-cqrs_rabbitmq=1
docker service scale --detach=false node-cqrs_message-store=2
docker service scale --detach=false node-cqrs_message-command=2
docker stack services node-cqrs

http post :3001/api/v1/messages and=one
http post :3001/api/v1/messages and=two
http post :3001/api/v1/messages and=three
http post :3001/api/v1/messages and=four!
docker service logs node-cqrs_message-command

docker service scale --detach=false node-cqrs_message-frontend=3
docker stack services node-cqrs
http post :3000
http post :3000
docker service logs node-cqrs_message-frontend

docker swarm leave --force
#bash bin/cleanup.bash
