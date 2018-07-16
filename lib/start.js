const server = require('./server');
const PORT = 8081;

server.listen(PORT, () => console.log(`Server listens at port ${PORT}!`))