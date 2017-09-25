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

app.post('/api/v1/message', (req, res) => {
  const message = req.body;
  res.send('Hello World!');
});

const port = process.env.MESSANGER_PORT || process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}/`);
});
