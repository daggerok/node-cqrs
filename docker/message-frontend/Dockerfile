FROM node:8.5.0-alpine
MAINTAINER Maksim Kostromin <daggerok@gmail.com>
EXPOSE 3000
RUN mkdir -p /home/node/app/message-frontend
WORKDIR /home/node/app
ENTRYPOINT ["node", "./message-frontend"]
ADD ./package.json /home/node/app/package.json
ADD ./node_modules /home/node/app/node_modules
ADD ./message-frontend /home/node/app/message-frontend
