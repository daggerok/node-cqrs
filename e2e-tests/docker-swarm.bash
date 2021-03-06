#!/usr/bin/env bash

# enable debug output
set -x

# bootstrap whole infrastructure using docker-swarm cluster and docker stack deploy
bash bin/swarm-up.bash

# test message-command REST API
http post :3001/api/v1/messages and=1
http post :3001/api/v1/messages and=2
http post :3001/api/v1/messages and=3
http post :3001/api/v1/messages and=4

# verify if messages where received via rabbitmq broker
docker service logs app_message-command
docker service logs app_message-store

# message-frontend
http post :3000
http post :3000
docker service logs app_message-fronted

# shutdown and clean up afterward
bash bin/cleanup.bash
