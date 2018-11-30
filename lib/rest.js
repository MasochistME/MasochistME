const express = require('express')
    , fs = require('fs')
    , _path = require('path')
    , paths = require('./data/paths')
    , update = require('./update')
    , passport = require('passport')
    , router = express.Router()

/**
 * This is the general function for returning dynamic data stored on server, like games list, member list, blog entries etc.
 * @param {*} req - Express request
 * @param {*} res - Express response
 * @param {string} type - type of data you want to receive
 */
const getData = (req, res, type) => {
    const resource = paths.find(r => r.id === type);
    !resource
        ? res.status(404).send('Resource Not Found!')
        : fs.readFile(_path.join(__dirname, resource.path), 'utf8', (err, data) => {
            err
                ? res.status(404).send(err)
                : res.status(200).send(JSON.parse(data));
    })
}
/**
 * Those are functions fetching more specific data for particular pages.
 * @param {*} req - Express request
 * @param {*} res - Express response
 */
// API
const getGamesData = (req, res) => getData(req, res, 'games')
const getMembersData = (req, res) => getData(req, res, 'members')
const getBlogData = (req, res) => getData(req, res, 'blog')
const getEventsData = (req, res) => getData(req, res, 'events')
// DATA
const getRatingData = (req, res) => getData(req, res, 'rating')
const getUpdateData = (req, res) => getData(req, res, 'update')

// API
router.get('/api/games', getGamesData)
router.get('/api/members', getMembersData)
router.get('/api/blog', getBlogData)
router.get('/api/events', getEventsData)

// DATA
router.get('/data/rating', getRatingData)

// UPDATE
router.get('/update', update.call)
router.get('/lastUpdate', getUpdateData)

// STATUS
router.get('/status', update.status)


// AUTH
router.post('/auth/steam',
  passport.authenticate(
    'steam', 
    { failureRedirect: '/' }
  ), (req, res) => { });

router.get('/auth/steam/return',
  (req, res, next) => {
    req.url = req.originalUrl
    next()
  },
  passport.authenticate(
    'steam', 
    { failureRedirect: '/' }
  ), (req, res) => res.redirect('/'));

module.exports = router