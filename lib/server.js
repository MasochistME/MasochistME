const express = require('express');
const rest = require('./rest');

const app = express();
app.use('/', rest);

module.exports = app;