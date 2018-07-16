const express = require('express');
const fs = require('fs');
const router = express.Router();

const getTabsConfig = (req, res) => {
    fs.readFile('./config/tabs.json', 'utf8', (err, data) => {
        if (err)
            return res.status(404).send('404 Not Found!')
        return res.status(200).send(JSON.parse(data));
    })
};

// REST
router.get('/tabs', getTabsConfig)

module.exports = router;