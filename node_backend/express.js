//Express server
const express = require('express');
const app = express();

//Add middleware
app.use((req, resp, next) => {
  console.log('First middleware');
  next();
});

app.use((req, resp, next) => {
  console.log('Second middleware');
  resp.send('Response from the express server');
});

module.exports = app;
