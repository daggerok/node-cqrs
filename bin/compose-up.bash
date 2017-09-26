#!/usr/bin/env bash

# enable debug output
set -x

# bootstrap whole infrastructure using docker-compose
docker-compose -f docker/docker-compose-all.yml up -d --build
