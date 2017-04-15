# node-cqrs [![build](https://travis-ci.org/daggerok/node-cqrs.svg?branch=master)](https://travis-ci.org/daggerok/node-cqrs)

TODO: implement this...

    (ui update data) >>
        [produce command] >>
            [handle rabbit event] >>
                [save data into eventstore mongodb (master node)]
    ...
    eventual consistency
    ...
    (ui fetch data) >> | pooling | websockets | backpreassure
        [query view / projection] >>
            [get data from mongodb (replica node)]

```bash
npm i
```

links:
- [express](http://expressjs.com/en/4x/api.html)
- [mongodb-express](https://www.terlici.com/2015/04/03/mongodb-node-express.html)
- [rabbitmq](https://www.rabbitmq.com/)
- [servicebus](https://www.npmjs.com/package/servicebus)
- [servicebus-retry](https://github.com/mateodelnorte/servicebus-retry)
- [servicebus-register-handlers](https://github.com/mateodelnorte/servicebus-register-handlers)
- [servicebus-trace](https://github.com/mateodelnorte/servicebus-trace)
