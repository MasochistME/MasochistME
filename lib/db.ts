import { MongoClient } from 'mongodb';
import { log } from '../log';
import { cache, collections } from '../cache';

export const connectToDb = () => {
    const dbName = 'fetus';
    const url = `mongodb://89.47.165.141:27017/${dbName}`;
    
    const callback = (err, client) => {
        if (err)
            log.WARN(`Error while connecting to database: ${err}`);
        log.INFO('Succesfully connected to the database!');

        cache["db"] = client.db(dbName);
        updateCache();
    };

    MongoClient.connect(url, callback);
}

export const updateCache = () => 
    collections.map(collection => findCollection(cache["db"], collection, (err, data) => {
        err ? log.WARN(err) : cache[collection] = data;
    }));

export const insertData = (col, key, value, cb) => {
    cache["db"].collection(col).insertOne({ [key]: value }, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting ${key.toUpperCase()} data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully added data to ${col.toUpperCase()} collection.`)
        return cb(null);
    });
}

const findCollection = (db, col, cb) => db.collection(col).find({}).toArray((err, data) => cb(err, data));