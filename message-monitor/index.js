const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

morgan.token('service', () => 'monitor');

if (app.get('env') === 'development')
  app.use(morgan(':service :remote-addr :method :url :status :response-time ms'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * environment variables
 */

const {
  RABBITMQ_HOST,
  RABBITMQ_URL,
  MESSAGE_MONITOR_PORT,
  PORT,
} = process.env;

/**
 * rambbitmq connection
 */

const rabbitHost = RABBITMQ_HOST || '127.0.0.1';
const rabbitUrl =  RABBITMQ_URL || `amqp://${rabbitHost}:5672`;
const bus = require('servicebus').bus({ url: rabbitUrl });

/**
 * event handlers
 */

const events = {
  create: 'messages.create',
};

bus.listen(events.create, payload => {
  console.log('monitor: received', events.create, 'event -', payload)
});

/**
 * default fallback / health endpoint
 */

app.use('/**', (req, res) => res.json({ health: 'monitor OK' }));

/**
 * bootstrap
 */

const port = MESSAGE_MONITOR_PORT || PORT || 3003;

app.listen(port, () => console.log(`
  message-monitor service is listening ${port} port.
`));
