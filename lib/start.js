const server = require('./server')
const cache = require('./cache/cache')
const games = require('../api/games.json')
const members = require('../api/members.json')
const log = require('../api/log.json')
const lastUpdated = require('../api/update.json').lastUpdated

const PORT = 3001;

cache.games = games
cache.members = members
cache.log = log
cache.lastUpdated = lastUpdated

server.listen(PORT, () => console.log(`Server listens at port ${PORT}!`))