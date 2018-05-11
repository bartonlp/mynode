#! /usr/bin/env node
// Proxy port 7000
// If protical is http to http on 7001 and https on 7002

const fs = require('fs'),
http = require('http'),
https = require('https'),
path = require('path'),
logger = require(path.join(__dirname,"logger.js"));
app = require(path.join(__dirname, 'app'));

const port = normalizePort(process.env.PORT || '7000');
app.set('port', port);

const httpsPort = port;
const httpPort = port + 1;

var httpsOptions = {
  // /etc/letsencrypt/live and /etc/letsencrypt/archive need to have
  // /group=barton and chmod g+rw.
  // They are normally group=root and group has no permissions.
  key: fs.readFileSync('/etc/letsencrypt/live/bartonlp.org/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bartonlp.org/fullchain.pem')
};

const httpserver = http.createServer(app).listen(httpPort);
const server = https.createServer(httpsOptions, app).listen(httpsPort);

httpserver.on('error', error => logger.error("http error: ", error));
httpserver.on('listening', () => logger.info(`http listening on: ${httpPort}`));
server.on('error', error => logger.error("https errro: ", error));
server.on('listening', () => logger.info(`https listening on: ${httpsPort}`));

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
