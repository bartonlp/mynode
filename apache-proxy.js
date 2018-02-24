// Proxy both Node and Apache to a different port.
// Set up port 80 as the primary port for the proxy

var http = require('http'),
httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: "http://bartonlp.org:7000"
}).listen(9000, () => console.log("proxy listening on 9000"));

proxy.on("error", (err) => console.log("server: ", err));

/*
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(7000, () => console.log("http listening on 7000"));
*/

