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
docker service logs node-cqrs_message-command

# message-frontend
http post :3000
http post :3000
docker service logs node-cqrs_message-fronted

# shutdown
bash bin/swarm-down.bash

## and clean up afterward
#bash bin/cleanup.bash
