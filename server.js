const http = require('http');

const server = http.createServer((req, resp) => {
  resp.end('hi, this is from node server');
});

server.listen(process.env.PORT || 3000);
