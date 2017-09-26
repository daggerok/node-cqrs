const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express();

const {
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_URL,
  MESSAGE_COMMAND_PORT,
  PORT,
} = process.env;

if (app.get('env') === 'development') app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Max-Age", "3600");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const events = {
  create: 'messages.create',
};

const rabbitHost = RABBITMQ_HOST || '127.0.0.1';
const rabbitPort = RABBITMQ_PORT || '5672';
const rabbitUrl =  RABBITMQ_URL || `amqp://${rabbitHost}:${rabbitPort}`;
const bus = require('servicebus').bus({ url: rabbitUrl });

bus.listen(events.create, e => {
  console.log('message created', e);
});

const router = express.Router();

router.post('/api/v1/messages', (req, res) => {
  const id = uuid.v4();
  const message = req.body;
  bus.send(events.create, { id, message });
  res.json({ id });
});

app.use(router);

app.use((req, res) => res.json({ health: 'OK' }));

const port = MESSAGE_COMMAND_PORT || PORT || 3001;

app.listen(port, () =>
  console.log(`message-command service is listening ${port} port.`));
