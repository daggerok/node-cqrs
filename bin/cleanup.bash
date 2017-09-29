#!/usr/bin/env bash

docker-compose -f docker/docker-compose-application-services.yml down -v
docker swarm leave --force
docker system prune --all --force
