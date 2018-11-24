const KEY = require('../config').KEY; 
const fs = require('fs')
const _path = require('path')
const _ = require('lodash')
const cache = require('./cache/cache')
const lastUpdate = require('../api/update')
const updateCuratedGames = require('./api/curatedgames')
const updateMembersData = require('./api/membersdata')
const updateAchievementsData = require('./api/achievements')
const updateSummaryData = require('./api/summary')

let update = null;
let server = {
    updating: false,
    updateStatus: 0,
    lastUpdate: lastUpdate.lastUpdate,
    crash: false
}

/**
 * The main update class, storing all the logic behind more specified server requests.
 * It's a singleton, invoked a single time in the lib/rest.js file.
 */
class Update {
    constructor() {
        if (update)
            return update;
        update = this;
    }

    /**
     * Function finalizing the update. Saves all the updated data to its designated files given that everything went without problems.
     * @param {*} path - path of file to which data ought to be saved
     * @param {*} data - data to be saved
     */
    saveToFile(path, data) { 
        fs.writeFile(_path.join(__dirname, path), JSON.stringify(data), err => {
            err
                ? console.log(err)
                : console.log('Saved!')
        })
    }

    /**
     * Function responsible for saving data to cache.
     * @param {*} type - to which cache part data should be saved
     * @param {*} data - data to save
     */
    saveToCache(type, data) {
        cache[type] = data;
    }

    /**
     * Function responsible for merging together all saving methods.
     * @param {*} type 
     * @param {*} data 
     */
    save(type, data) {
        update.saveToCache(type, data);
        update.saveToFile(`../api/${type}.json`, data)
    }

    /**
     * Returns the status of the server.
     * @param {*} req - Express request
     * @param {*} res - Express response
     */
    status(req, res) {
        const statusSummary = {
            lastUpdate: server.lastUpdate,
            updating: server.updating,
            updateStatus: server.updateStatus,
            serverStatus: server.crash ? "crashed" : "working"
        }
        res.status(200).send(statusSummary)
    }

    /**
     * Function behind logic of calling the crash on server.
     * Should be called every time the update for some reason gets interrupted and server hangs.
     * @param {*} e - error which triggered the crash
     */
    crash(e) {
        server.crash = true;
        server.updating = false;
        server.updateStatus = 0;
        console.trace(e)
    }

    /**
     * Function handling all the pre-update preparation process.
     * @param {*} req - Express request
     * @param {*} res - Express responses
     */
    call(req, res) {
        if (server.updating) 
            return res.status(500).send( {content: "Already updating"} );
        server.updating = true;
        update.start();
        return res.status(200).send( {content: "Update started!"} );
    }

    /**
     * Function handling the proper update finalization.
     */
    finish() {
        if (server.crash)
            return 
        server.updateStatus = 0
        server.updating = false
        server.lastUpdate = Date.now()
        update.save('update', { lastUpdate: server.lastUpdate })
    }

    /**
     * Updates the progress percentage exposed to API.
     * @param {*} percentage 
     */
    progress(percentage) {
        server.updateStatus = percentage;
    }

    /**
     * [WIP]
     * The main update function. 
     * All the update methods are invoked here in a form of pipe.
     */
    async start() {
        update.progress(1)
        
        const gamesData = await updateCuratedGames()
            .then(data => update.save('games', data))
            .catch(e => update.crash(e));
        update.progress(33);

        if (!server.crash)
        const membersData = await updateMembersData()
            .then(data => update.save('members', data))
            .catch(e => update.crash(e));
        update.progress(66)

        if (!server.crash)
        const achievementsData = await updateAchievementsData()
            .then(data => update.save('members', data))
            .catch(e => update.crash(e));
        update.progress(90)

        if (!server.crash)
        const summaryData = await updateSummaryData()
            .then(data => update.save('members', data))
            .catch(e => update.crash(e));
        update.progress(99)

        if (!server.crash)
        update.save('log', _.orderBy(cache.log, ['date'], ['desc']))
        update.progress(100)

        update.finish()
    }
}

module.exports = new Update()