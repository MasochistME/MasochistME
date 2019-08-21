import { MongoClient } from 'mongodb';
import { log } from '../log';
import { cache } from '../cache';

export const connectToDb = (dbObject:any) => {
    const callback = (err, client) => {
        if (err)
            log.WARN(`Error while connecting to database: ${err}`);
        log.INFO(`Succesfully connected to the ${dbObject.symbol.toUpperCase()} database!`);

        cache["dbs"][dbObject.symbol] = client.db(dbObject.symbol);
        updateCache(dbObject.symbol);
    };
    
    MongoClient.connect(dbObject.url, callback);
}

export const updateCache = (dbSymbol:string) => {
    cache["dbs"][dbSymbol].listCollections().toArray((err, collections) => {
        collections.map(collection => {
            findCollection(cache["dbs"][dbSymbol], collection.name, (err, data) => {
                err ? log.WARN(err) : cache[collection.name] = data;
            })
        })
    })
}

export const insertData = (dbSymbol:string, col, key, value, cb) => {
    cache["dbs"][dbSymbol].collection(col).insertOne({ [key]: value }, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting ${key.toUpperCase()} data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully added data to ${dbSymbol.toUpperCase()}.${col.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const insertMany = (dbSymbol:string, collection:string, manyObjects:Array<object>, cb) => {
    cache["dbs"][dbSymbol].collection(collection).insertMany(manyObjects, (err, result) => {
        if (err) {
            log.WARN(`Error during inserting data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully added data to ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const updateOne = (dbSymbol:string, collection:string, filter:Object, set:Object, cb) => {
    cache["dbs"][dbSymbol].collection(collection).updateOne(
        filter, 
        { $set: set },
        // { $unset: unset },
        (err, result) => {
        if (err) {
            log.WARN(`Error during updating data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully updated data in ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const updateMany = (dbSymbol:string, collection:string, filter:Object, set:Array<object>, cb) => {
    cache["dbs"][dbSymbol].collection(collection).updateMany(
        filter, 
        { $set: set },
        // { $unset: unset },
        (err, result) => {
        if (err) {
            log.WARN(`Error during updating data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully updated data in ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const replaceOne = (dbSymbol:string, collection:string, filter:Object, replacement:Object, cb) => {
    cache["dbs"][dbSymbol].collection(collection).replaceOne(
        filter, 
        replacement,
        { upsert: true },
        (err, result) => {
        if (err) {
            log.WARN(`Error during replacing data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully replaced data in ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const replaceMany = (dbSymbol:string, collection:string, filter:Object, replacement:Array<object>, cb) => {
    cache["dbs"][dbSymbol].collection(collection).replaceMany(
        filter, 
        replacement,
        { upsert: true },
        (err, result) => {
        if (err) {
            log.WARN(`Error during replacing data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully replaced data in ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const upsertOne = (dbSymbol:string, collection:string, filter:Object, object:Object, cb) => {
    cache["dbs"][dbSymbol].collection(collection).updateOne(filter, {$set: object}, { upsert: true }, (err, result) => {
        if (err) {
            log.WARN(`Error during upserting data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully upserted data to ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const upsertMany = (dbSymbol:string, collection:string, filter:Object, manyObjects:Array<object>, cb) => {
    cache["dbs"][dbSymbol].collection(collection).updateMany(filter, {$set: manyObjects}, { upsert: true }, (err, result) => {
        if (err) {
            log.WARN(`Error during upserting data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully upserted data to ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const deleteOne = (dbSymbol:string, collection:string, filter:Object, cb) => {
    cache["dbs"][dbSymbol].collection(collection).deleteOne(filter, (err, result) => {
        if (err) {
            log.WARN(`Error during deleting data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully deleted data from ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

export const deleteMany = (dbSymbol:string, collection:string, filter:Object, cb) => {
    cache["dbs"][dbSymbol].collection(collection).deleteMany(filter, (err, result) => {
        if (err) {
            log.WARN(`Error during deleting data.`);
            return cb(err);
        }
        updateCache(dbSymbol);
        log.INFO(`Succesfully deleted data from ${dbSymbol.toUpperCase()}.${collection.toUpperCase()} collection.`)
        return cb(null);
    });
}

const findCollection = (database, collection, cb) => database.collection(collection).find({}).toArray((err, data) => cb(err, data));
