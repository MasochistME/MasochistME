import express from 'express';
import path from 'path';

const PORT = 3000;

const server = express();

server.listen(PORT, () => console.log(`Server listens at port ${PORT}!`));

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
server.use('/', express.static(path.join(path.dirname(''), '/..', 'build')));
