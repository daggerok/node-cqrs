#!/usr/bin/env bash

# enable debug output
set -x

# clean up afterward
docker-compose -f docker/docker-compose-all.yml down -v
