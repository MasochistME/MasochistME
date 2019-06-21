import { MongoClient } from 'mongo';
import { log } from '../helpers/log';
import config from '../../config.json';

export const connectToDb = () => MongoClient.connect(config.DATABASE_URL, (err, client) => {
    if (err)
        log.WARN(`Error while connecting to database: ${err}`);
    log.INFO(`Succesfully connected to the database!`);

    return client.db('masochist');
})