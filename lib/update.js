const KEY = require('../config').KEY; 
const fs = require('fs')
const _path = require('path')
const updateCuratedGames = require('./api/curatedgames')
const updateMembersData = require('./api/membersdata')

let update = null;
let server = {
    updating: false,
    updateStatus: 0,
    lastUpdate: 0,
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
    saveData(path, data) { 
        fs.writeFile(_path.join(__dirname, path), JSON.stringify(data), err => {
            err
                ? console.log(err)
                : console.log('Saved!')
        })
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
     * [WIP]
     * The main update function. 
     * All the update methods are invoked here in a form of pipe.
     */
    start() {
        // mock functions
        let timer = 0;

        const updateInProgres = () => {
            timer++;
            server.updateStatus = timer;
        }
        const updateFinished = () => {
            clearInterval(updateInterval);
            server.lastUpdate = Date.now();
            server.updating = false;
        }
        const updateInterval = setInterval(() => {
            timer == 100
                ? updateFinished() 
                : updateInProgres()
        }, 100)
        // end of mock functions
        
        // updateCuratedGames()
        //     .then(gamesData => update.saveData('../api/games.json', gamesData))
        //     .catch(e => update.crash(e));
        updateMembersData()
            .then(membersData => update.saveData('../api/members.json', membersData))
    }
}

module.exports = new Update()