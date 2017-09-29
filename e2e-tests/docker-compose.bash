#!/usr/bin/env bash

# enable debug output
set -x

# bootstrap whole infrastructure using docker-compose
bash bin/compose-up.bash

# test message-command REST API
http post :3001/api/v1/messages and=1
http post :3001/api/v1/messages and=2
http post :3001/api/v1/messages and=3
http post :3001/api/v1/messages and=4
http post :3000
http post :3000

# verify if messages where received via rabbitmq broker
docker logs docker_message-frontend_1
docker logs docker_message-command_1
docker logs docker_message-store_1

# shutdown
bash bin/cleanup.bash
