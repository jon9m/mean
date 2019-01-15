//Basic server
const http = require('http');  //pre installed with Node
const app = require('./node_backend/express');

// const server = http.createServer((req, resp) => {
//   resp.end('hi, this is from node server');
// });

const port = process.env.PORT || 3000;

//app.set('port', port);
const server = http.createServer(app);

server.listen(port);

