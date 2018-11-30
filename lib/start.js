const server = require('./server')
const cache = require('./cache/cache')
const games = require('../api/games.json')
const members = require('../api/members.json')
const log = require('../api/log.json')
const lastUpdate = require('../api/update.json').lastUpdate

const PORT = 3000;

cache.games = games
cache.members = members
cache.log = log
cache.update.lastUpdate = lastUpdate

server.listen(PORT, () => console.log(`Server listens at port ${PORT}!`))