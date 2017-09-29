FROM rabbitmq:3.6.12-management-alpine
MAINTAINER Maksim Kostromin <daggerok@gmail.com>
EXPOSE 5672 15672 61613
RUN apk --no-cache add curl \
 && rabbitmq-plugins enable rabbitmq_stomp --offline
HEALTHCHECK --interval=5s --timeout=5s --retries=20 CMD curl -f http://127.0.0.1:15672 || exit 1
