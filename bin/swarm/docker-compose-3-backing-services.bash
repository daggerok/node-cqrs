#!/usr/bin/env bash
set -x

docker service create --detach=false --name registry --publish 5000:5000 registry:2

docker-compose -f docker/docker-compose-3-backing-services.yml build --force-rm --no-cache --pull
docker-compose -f docker/docker-compose-3-backing-services.yml push

docker stack deploy --compose-file docker/docker-compose-3-backing-services.yml app

for suffix in visualizer rabbitmq mongo; do
  service_name="app_$suffix"
  echo "waiting for $service_name bootstrap..."
  docker stack services --filter name="$service_name" --format="{{.Name}} {{.Replicas}}" app
  #set +x
  while [ $(docker stack services --filter name="$service_name" --format="{{.Replicas}}" app) != "1/1" ]; do
    sleep 2
  done
  #set -x
done

docker stack services app
