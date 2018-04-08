// node log.js
// Test logger

const morgan = require('morgan');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();

const port = '3000';

app.set('port', port);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.log'), {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', function (req, res) {
  res.send('<h1>hello, world!</h1><p>This is a test</p>');
});

app.listen(port, function(){
  console.log('Example log.js listening on port ' + port);
});

