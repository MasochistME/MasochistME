const express = require('express');
const fs = require('fs');
const _path = require('path')
const paths = require('../config/paths')
const router = express.Router();
const update = require('./update')

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
router.get('/update', update.call)

// STATUS
router.get('/status', update.status)

module.exports = router