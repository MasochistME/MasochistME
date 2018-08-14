const express = require('express');
const rest = require('./rest');

const server = express();
server.use('/api', rest);

module.exports = server;