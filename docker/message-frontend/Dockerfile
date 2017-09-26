FROM node:8.5.0-alpine
MAINTAINER Maksim Kostromin <daggerok@gmail.com>
RUN apk --no-cache add curl
EXPOSE 3000
HEALTHCHECK --interval=3s --timeout=3s --retries=5 CMD curl -f http://127.0.0.1:3000 || exit 1
RUN mkdir -p /home/node/app/message-frontend
WORKDIR /home/node/app
ENTRYPOINT ["node", "./message-frontend"]
ADD ./package.json /home/node/app/package.json
ADD ./node_modules /home/node/app/node_modules
ADD ./message-frontend /home/node/app/message-frontend
