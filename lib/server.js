const express = require('express'),
  path = require('path'),
  rest = require('./rest'); // think of removing CORS and setting up server with the same port

const server = express();

// MIDDLEWARE
server.use((req, res, next) => {
  res.set({
    'Access-Control-Request-Method': 'GET',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  });
  next();
});
server.use('/', express.static(path.join(__dirname, '/..', 'build')));

module.exports = server;
