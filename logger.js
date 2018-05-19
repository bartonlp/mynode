// logger.js part of app.js, httpredirect.js, routes/*
// Use Winston

const winston = require("winston");
const path = require('path');

const level = process.env.LOG_LEVEL || 'debug';
const transport = process.env.DEBUG == 'true' ? winston.transports.Console : winston.transports.File;

const logger = new winston.Logger({
  transports: [new transport({
    filename: path.join(__dirname, 'access.log'),
    json: false,
    level: level,
    timestamp: function () {
      return (new Date()).toISOString();
    }
  })
              ]
});

module.exports = logger;

