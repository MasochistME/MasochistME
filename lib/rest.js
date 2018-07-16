const express = require('express');
const fs = require('fs');
const paths = require('../config/paths')
const router = express.Router();

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

// REST
router.get('/games', getGamesData)

module.exports = router