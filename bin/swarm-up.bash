#!/usr/bin/env bash

docker swarm init
bash bin/swarm/docker-compose-3-backing-services.bash
bash bin/swarm/docker-compose-3-application-services.bash
