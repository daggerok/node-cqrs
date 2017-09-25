FROM node:8.5.0-alpine
MAINTAINER Maksim Kostromin <daggerok@gmail.com>
EXPOSE 3000
RUN mkdir -p /home/node/app/messanger
WORKDIR /home/node/app
ENTRYPOINT ["node", "./messanger"]
ADD . /home/node/app
