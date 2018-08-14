const KEY = require('../config').KEY;

let storage = null;
let updating = false;
let updateStatus = 0;
let crash = false;
let lastUpdate = 0;

class Storage {
    constructor() {
        if (storage)
            return storage;
        storage = this;
    }

    status(req, res) {
        const statusSummary = {
            lastUpdate: lastUpdate,
            updating: updating,
            updateStatus: updateStatus,
            serverStatus: crash ? "crashed" : "working"
        }
        res.status(200).send(statusSummary)
    }

    callUpdate(req, res) {
        if (updating) 
            return res.status(500).send( {content: "Already updating"} );
        updating = true;
        storage.update()
        return res.status(200).send( {content: "Update started!"} );
    }

    update() {
        let timer = 0;

        const updateFinished = () => {
            clearInterval(updateInterval);
            lastUpdate = Date.now();
            updating = false;
        }
        const updateInProgres = () => {
            timer++;
            updateStatus = timer;
        }
        const updateInterval = setInterval(() => {
            timer == 100
                ? updateFinished() 
                : updateInProgres()
        }, 100)
    }
}

module.exports = new Storage()