#!/usr/bin/env bash

# enable debug output
set -x

# clean up afterward
docker swarm leave --force
