FROM node:8.5.0-alpine
MAINTAINER Maksim Kostromin <daggerok@gmail.com>
EXPOSE 3000
RUN mkdir -p /home/node/app/message-command
WORKDIR /home/node/app
ENTRYPOINT ["node", "./message-command"]
ADD ./package.json /home/node/app/package.json
ADD ./node_modules /home/node/app/node_modules
ADD ./message-command /home/node/app/message-command
