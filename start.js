
const https = require("https"),
http = require("http"),
helmet = require("helmet"),
app = require('./app'),
fs = require("fs");

const options = {
  key: fs.readFileSync('./privkey.pem'),
  cert: fs.readFileSync('./fullchain.pem')
};

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/*app.use(helmet());
app.use((req, res) => {
  res.writeHead(200);
  res.end("hello world\n");
});
*/

https.createServer(options, app).listen(port);
console.log("Listening on " +port);

/**
 * Normalize a port into a number, string, or false.
 */

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
