const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

morgan.token('service', () => 'store');

if (app.get('env') === 'development')
  app.use(morgan(':service :remote-addr :method :url :status :response-time ms'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * environment variables
 */

const {
  MONGODB_HOST,
  MONGODB_URL,
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_URL,
  MESSAGE_STORE_PORT,
  PORT,
} = process.env;

/**
 * mongodb connection
 */

const mongoHost = MONGODB_HOST || '127.0.0.1';
const mongoUrl = MONGODB_URL || `mongodb://${mongoHost}/messages`;
const options = { useMongoClient: true };
const mongoose = require('mongoose');

mongoose.connect(mongoUrl, options);

/**
 * rambbitmq connection
 */

const rabbitHost = RABBITMQ_HOST || '127.0.0.1';
const rabbitPort = RABBITMQ_PORT || '5672';
const rabbitUrl =  RABBITMQ_URL || `amqp://${rabbitHost}:${rabbitPort}`;
const bus = require('servicebus').bus({ url: rabbitUrl });

/**
 * event handlers
 */

const messageSchema = new mongoose.Schema({
    id: String,
    message: {
      content: String,
    },
  },
  {
    strict: false,
  }
);
const Message = mongoose.model('Message', messageSchema);
const events = {
  create: 'messages.create',
};

mongoose.Promise = global.Promise;
bus.listen(events.create, payload => {
  const message = new Message(Object.assign({}, payload));
  const promise = message.save();
  promise.then(document => {
    console.info('store: saved document');
    console.info(document);
  });
});

/**
 * default fallback / health endpoint
 */

app.use('/**', (req, res) => res.json({ health: 'store OK' }));

/**
 * bootstrap
 */

const port = MESSAGE_STORE_PORT || PORT || 3002;

app.listen(port, () => console.log(`
  message-store service is listening ${port} port.
`));
