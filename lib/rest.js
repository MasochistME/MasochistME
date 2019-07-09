const express = require('express')
    , axios = require('axios')
    , router = express.Router()


const getData = (url, res) => {
  axios.get(url)
    .then(data => res.status(200).send(data.data))
    .catch(err => res.status(500).send(err))
}
const putData = (url, res) => {
  axios.put(url)
    .then(data => res.status(200).send(data.data))
    .catch(err => res.status(500).send(err))
}

/**
 * Those are functions fetching more specific data for particular pages.
 * @param {*} req - Express request
 * @param {*} res - Express response
 */
// API
const getGamesData = (req, res) => getData('http://localhost:3002/rest/curator/games', res);
const getMembersData = (req, res) => getData('http://localhost:3002/rest/users', res);
const getBlogData = (req, res) => getData('http://localhost:3002/rest/blog', res);
const getEventsData = (req, res) => getData('http://localhost:3002/rest/events', res);
const getPatronsData = (req, res) => getData('http://localhost:3002/rest/patrons', res);
const getBadgesData = (req, res) => getData('http://localhost:3002/rest/badges', res);

// DATA
const getRatingData = (req, res) => getData('http://localhost:3002/rest/special/rating', res);
const getUpdateData = (req, res) => getData('http://localhost:3002/rest/status', res);
const putUpdateUser = (req, res) => putData(`http://localhost:3002/rest/users/user/${req.params.steamid}`, res);

// API
router.get('/api/games', getGamesData)
router.get('/api/members', getMembersData)
router.get('/api/blog', getBlogData)
router.get('/api/events', getEventsData)
router.get('/api/patrons', getPatronsData)
router.get('/api/badges', getBadgesData)
router.get('/api/rating', getRatingData)

router.put('/users/user/:steamid', putUpdateUser)

// router.get('/update', update.call)
// router.get('/lastUpdate', getUpdateData)
// router.get('/status', update.status)

module.exports = router