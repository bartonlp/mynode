// Proxy port 7000
// If protical is http to http on 7001 and https on 7002

const fs = require('fs'),
net = require('net'),
http = require('http'),
https = require('https'),
app = require('./app');

var port = normalizePort(process.env.PORT || '7000');
app.set('port', port);

var baseAddress = port;
var redirectAddress = port + 1;
var httpsAddress = port + 2;

var httpsOptions = {
  key: fs.readFileSync('./privkey.pem'),
  cert: fs.readFileSync('./fullchain.pem')
};

const netserver = net.createServer(tcpConnection).listen(baseAddress);
const httpserver = http.createServer(httpConnection).listen(redirectAddress);
const server = https.createServer(httpsOptions, app).listen(httpsAddress);

netserver.on('error', error => console.log("net error: ", error));
httpserver.on('error', error => console.log("http error: ", error));

server.on('error', onError);
server.on('listening', onListening);

function tcpConnection(conn) {
  conn.on('error', (err) => {
    let dt = new Date();
    console.log("tcpConnection (" +dt+ ") Error.stack: ", err.stack);
  });

  // do this once. It is like 'on' but only 'once'
  
  conn.once('data', function (buf) {
    // A TLS handshake record starts with byte 22.
    // If the handshake is 22 (https)
    // otherwise do the 'redirectAddress'
    
    var address = (buf[0] === 22) ? httpsAddress : redirectAddress;
    var proxy = net.createConnection(address, function () {
      proxy.write(buf);
      conn.pipe(proxy).pipe(conn);
    });
  });
}

// This is the http connection.
// It grabs the 'host' and redirects it via 301 (Moved Permanently) to
// the https

function httpConnection(req, res) {
  var host = req.headers['host'];
  res.writeHead(301, { "Location": "https://" + host + req.url });
  res.end();
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if(error.syscall !== 'listen') {
    console.log("not listen: ", error.syscall);
    throw error;
  }

  var bind = typeof port === 'string'
             ? 'Pipe ' + port
             : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      //process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      //process.exit(1);
      break;
    default:
      console.error("sitch default", error);
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(`Listening on: net ${port}, http ${port +1}, https ${port +2}`);
}


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
