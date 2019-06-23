import { ObjectId } from 'mongodb';
import { log } from '../helpers/log';
import { connectToDb } from '../helpers/db';
import { hash } from '../helpers/hash';
import config from '../config.json';

export const getAllBadges = async (req, res) => {
    const { client, db } = await connectToDb();
    const data = db.collection('badges');
    
    data.find({ }).toArray((err, badges) => {
        if (err) {
            log.WARN(err);
            res.status(err.code).send(err);
        }
        else {
            res.status(200).send(badges);
        }        
        client.close();
    })
};

export const getBadge = async (req, res) => {
    const { client, db } = await connectToDb();
    const data = db.collection('badges');
    
    data.findOne({ '_id': ObjectId(req.params.id) }, (err, badge) => {
        if (err) {
            log.WARN(err);
            res.status(err.code).send(err);
        }
        else if (!badge) {
            res.sendStatus(404);
        }
        else {
            res.status(200).send(badge);
        }        
        client.close();
    })
};

export const addBadge = async (req, res) => {
    if (!req.headers.auth) {
        res.sendStatus(401);
        return;
    }
    if (hash('sha256', req.headers.auth) !== config.AUTH) {
        log.WARN(`An unauthorized attempt to add badge noted with ${req.headers.auth} credentials.`)
        res.sendStatus(403);
        return;
    }
    if (!req.body) { // validation!!!
        res.sendStatus(400);
        return;
    }

    const { client, db } = await connectToDb();
    const data = db.collection('badges');

    data.insertOne(req.body, (err, badge) => {
        if (err) {
            log.WARN(err);
            res.status(err.code).send(err);
        }
        else if (!badge) {
            res.sendStatus(404);
        }
        else {
            log.INFO(`Badge ${req.params.id} added.`);
            res.status(201).send(badge);
        }        
        client.close();
    })
};

export const updateBadge = async (req, res) => {
    if (!req.headers.auth) {
        res.sendStatus(401);
        return;
    }
    if (hash('sha256', req.headers.auth) !== config.AUTH) {
        log.WARN(`An unauthorized attempt to add badge noted with ${req.headers.auth} credentials.`)
        res.sendStatus(403);
        return;
    }
    if (!req.body) { // validation!!!
        res.sendStatus(400);
        return;
    }

    const { client, db } = await connectToDb();
    const data = db.collection('badges');  

    data.updateOne({ '_id': ObjectId(req.params.id) }, { $set: req.body }, { upsert: true }, (err, badge) => {
        if (err) {
            log.WARN(err);
            res.status(err.code).send(err);
        }
        else if (!badge) {
            res.sendStatus(404);
        }
        else {
            log.INFO(`Badge ${req.params.id} updated.`);
            res.status(200).send(badge);
        }        
        client.close();
    })
};

export const deleteBadge = async (req, res) => {
    if (!req.headers.auth) {
        res.sendStatus(401);
        return;
    }
    if (hash('sha256', req.headers.auth) !== config.AUTH) {
        log.WARN(`An unauthorized attempt to add badge noted with ${req.headers.auth} credentials.`)
        res.sendStatus(403);
        return;
    }

    const { client, db } = await connectToDb();
    const data = db.collection('badges');
    
    data.deleteOne({ '_id': ObjectId(req.params.id) }, (err, badge) => {
        if (err) {
            log.WARN(err);
            res.status(err.code).send(err);
        }
        else if (!badge) {
            res.sendStatus(404);
        }
        else {
            log.INFO(`Badge ${req.params.id} deleted.`);
            res.sendStatus(204)
        }        
        client.close();
    })
};