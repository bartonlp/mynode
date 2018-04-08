#! /usr/bin/env node
// This is just an example and not the MAIN program.
// The main program is 'httpredirect.js' which loads 'app.js' and
// 'routes/index.js'

const express = require ('express'),
morgan = require('morgan'),
path = require('path'),
logger = require('logger').createLogger(path.join(__dirname, "index.log"));
fs = require('fs');

logger.setLevel("debug");

const PORT = 3000;

const app = express();

const stream = fs.createWriteStream(path.join(__dirname, 'index.log'), {flags: 'a'});

app.use(morgan('combined', {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: stream
}));

app.use(morgan('combined', {
  skip: function (req, res) {
    return res.statusCode >= 400
  },
  stream: stream
}));

app.get('/', function (req, res) {
  logger.debug('Debug statement: ', {test: 'this is a test'}, ['one', 'two']);
  logger.error('Error statement');
  logger.warn('Warning statement');
  logger.info('Info statement');
  res.send('<h1>Hello World!</h1>');
});

app.use(function(req, res, next){
  logger.error('404 page requested ' + req.url);
  res.status(404).send('This page does not exist!');
});

app.listen(PORT, function(){
  logger.info('Example app listening on port ' + PORT);
});
