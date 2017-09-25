const express = require('express');
const app = express();

const path = require('path');
const pathTo = rel => path.join(__dirname, '/', rel);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  //res.send('Hello!');
  res.json({
    message: 'Hi there!'
  });
});

const events = {
  types: {
    messages: {
      create: 'messages.create',
    },
  },
};

const busHost = process.env.RABBITMQ_HOST || '127.0.0.1';
const busPort = process.env.RABBITMQ_PORT || '5672';
const url =  process.env.RABBITMQ_URL || `amqp://${busHost}:${busPort}`;
const bus = require('servicebus').bus({ url });

bus.listen(events.types.messages.create, e => {
  console.log('message created', e);
});

app.post('/api/v1/message', (req, res) => {
  const message = req.body;
  const payload = {
    id: Date.now(),
    message,
  };
  bus.send(events.types.messages.create, {
    payload,
  });
  res.json({
    message: 'message sent',
  });
});

const port = process.env.MESSANGER_PORT || process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}/`);
});
