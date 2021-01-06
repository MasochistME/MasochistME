import { MongoClient } from 'mongodb';
import { log } from 'helpers/log';
import config from '../../config.json';

export const connectToDb: any = () =>
  new Promise(async (resolve, reject) => {
    await MongoClient.connect(config.DATABASE_URL, (err, client) => {
      if (err) {
        log.WARN(`Error while connecting to database: ${err}`);
        reject(err);
      }
      resolve({
        client,
        db: client.db('masochist'),
      });
    });
  });

export const getDataFromDB: any = (dataType: string, field?: object) =>
  new Promise(async (resolve, reject) => {
    const { client, db } = await connectToDb();
    const data = db.collection(dataType);
    const fieldToFind = field ? field : {};

    data.find(fieldToFind).toArray((err, response) => {
      if (err) {
        log.WARN(err);
        client.close();
        reject(err);
      } else {
        client.close();
        resolve(response);
      }
    });
  });
