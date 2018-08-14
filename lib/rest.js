const express = require('express');
const fs = require('fs');
const paths = require('../config/paths')
const router = express.Router();
const storage = require('./storage')

const getData = (req, res, type) => {
    const resource = paths.find(r => r.id === type);
    !resource
        ? res.status(404).send('Resource Not Found!')
        : fs.readFile(resource.path, 'utf8', (err, data) => {
            err
                ? res.status(404).send(err)
                : res.status(200).send(JSON.parse(data));
    })
}
const getGamesData = (req, res) => getData(req, res, 'games')
const getRankingData = (req, res) => getData(req, res, 'ranking')
const getBlogData = (req, res) => getData(req, res, 'blog')
const getEventsData = (req, res) => getData(req, res, 'events')

// REST
router.get('/games', getGamesData)
router.get('/ranking', getRankingData)
router.get('/blog', getBlogData)
router.get('/events', getEventsData)

// UPDATE
router.get('/update', storage.callUpdate)

// STATUS
router.get('/status', storage.status)

module.exports = router