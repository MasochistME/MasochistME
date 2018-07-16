const express = require('express');
const rest = require('./rest');

const app = express();
app.use('/api', rest);

module.exports = app;