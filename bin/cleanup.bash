#!/usr/bin/env bash

# enable debug output
set -x

# full (about ~1.02GB) cleanup
docker system prune --all
