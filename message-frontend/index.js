const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const {
  NODE_ENV,
  MESSAGE_COMMAND_HOST,
  MESSAGE_COMMAND_PORT,
  MESSAGE_FRONTEND_PORT,
  PORT,
} = process.env;

const inDevMode = () => app.get('env') === 'development';

if (inDevMode()) app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const path = require('path');
const frontendPath = rel => path.join(__dirname, '/', rel);

app.use(express.static(frontendPath('./static')));

const router = express.Router();
const messageCommandHost = MESSAGE_COMMAND_HOST || '127.0.0.1';
const messageCommandPort = MESSAGE_COMMAND_PORT || '3001';

const config = {
  NODE_ENV,
  MESSAGE_COMMAND_HOST,
  MESSAGE_COMMAND_PORT,
  MESSAGE_COMMAND_URL: `http://${messageCommandHost}:${messageCommandPort}`,
  PORT,
  env: app.get('env'),
};

console.log(config);

router.get('/config', (req, res) => {
  res.json({
    config,
  });
});

app.use(router);

app.use((req, res) => res.redirect('/'));


const port = MESSAGE_FRONTEND_PORT || PORT || 3000;

app.listen(port, () => console.log(`
  message-frontend service is running on http://localhost:${port}
`));
