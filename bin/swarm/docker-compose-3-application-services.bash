#!/usr/bin/env bash
set -x

docker build -f docker/message-store/Dockerfile -t 127.0.0.1:5000/message-store .
docker build -f docker/message-command/Dockerfile -t 127.0.0.1:5000/message-command .
docker build -f docker/message-frontend/Dockerfile -t 127.0.0.1:5000/message-frontend .

docker-compose -f docker/docker-compose-3-application-services.yml build --force-rm --no-cache --pull
docker-compose -f docker/docker-compose-3-application-services.yml push

docker push 127.0.0.1:5000/message-store
docker push 127.0.0.1:5000/message-command
docker push 127.0.0.1:5000/message-frontend

docker stack deploy --compose-file docker/docker-compose-3-application-services.yml app

sequence=1
for suffix in store command frontend; do
  service_name="app_message-$suffix"
  echo "waiting for $service_name bootstrap..."
  docker stack services --filter name="$service_name" --format="{{.Name}} {{.Replicas}}" app
  set +x
  while [ $(docker stack services --filter name="$service_name" --format="{{.Replicas}}" app) != "$sequence/$sequence" ]; do
    docker service scale --detach=false "$service_name"="$sequence"
  done
  sequence=$(expr "$sequence" + 1)
  set -x
done

docker stack services app
