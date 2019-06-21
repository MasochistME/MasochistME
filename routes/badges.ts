import { MongoClient, ObjectId } from 'mongodb';
import { log } from '../helpers/log';
import { connectToDb } from '../helpers/db';

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
    const { client, db } = await connectToDb();
    const data = db.collection('badges');
    
    if (!req.body) { // validation!!!
        res.sendStatus(400);
        return;
    }

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
    const { client, db } = await connectToDb();
    const data = db.collection('badges');
    
    if (!req.body) { // validation!!!
        res.sendStatus(400);
        return;
    }

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