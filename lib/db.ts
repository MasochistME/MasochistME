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

export const insertMany = (collection:string, manyObjects:Array<object>, cb) => {
    cache["db"].collection(collection).insertMany(manyObjects, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully added data to ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const updateOne = (collection:string, filter:Object, set:Object, cb) => {
    cache["db"].collection(collection).updateOne(
        filter, 
        { $set: set },
        // { $unset: unset },
        (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully updated data in ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const updateMany = (collection:string, filter:Object, set:Array<object>, cb) => {
    cache["db"].collection(collection).updateMany(
        filter, 
        { $set: set },
        // { $unset: unset },
        (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully updated data in ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const replaceOne = (collection:string, filter:Object, replacement:Object, cb) => {
    cache["db"].collection(collection).replaceOne(
        filter, 
        replacement,
        { upsert: true },
        (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully replaced data in ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const replaceMany = (collection:string, filter:Object, replacement:Array<object>, cb) => {
    cache["db"].collection(collection).replaceMany(
        filter, 
        replacement,
        { upsert: true },
        (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully replaced data in ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const upsertOne = (collection:string, filter:Object, object:Object, cb) => {
    cache["db"].collection(collection).updateOne(filter, {$set: object}, { upsert: true }, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully upserted data to ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const upsertMany = (collection:string, filter:Object, manyObjects:Array<object>, cb) => {
    cache["db"].collection(collection).updateMany(filter, {$set: manyObjects}, { upsert: true }, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully upserted data to ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const deleteOne = (collection:string, filter:Object, cb) => {
    cache["db"].collection(collection).deleteOne(filter, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully deleted data from ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const deleteMany = (collection:string, filter:Object, cb) => {
    cache["db"].collection(collection).deleteMany(filter, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache();
        log.INFO(`Succesfully deleted data from ${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

const findCollection = (database, collection, cb) => database.collection(collection).find({}).toArray((err, data) => cb(err, data));
