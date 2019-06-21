import { MongoClient } from 'mongodb';
import { log } from '../helpers/log';
import config from '../../config.json';

export const connectToDb:any = () => 
    new Promise(async (resolve, reject) => {
        await MongoClient.connect(config.DATABASE_URL, (err, client) => {
            if (err) {
                log.WARN(`Error while connecting to database: ${err}`);
                reject(err);
            }
            resolve({ 
                client, 
                db:client.db('masochist') 
            });
        })
    });