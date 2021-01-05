const server = require('./server');

const PORT = 3000;

server.listen(PORT, () => console.log(`Server listens at port ${PORT}!`));
