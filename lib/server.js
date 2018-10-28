const express = require('express');
const cors = require('cors')
const rest = require('./rest'); // think of removing CORS and setting up server with the same port

const server = express();
server.use(cors())
server.use('/', rest);

module.exports = server;