import { MongoClient } from 'mongodb';

import { log } from 'helpers/log';

export const connectToDb: any = () =>
  new Promise(async (resolve, reject) => {
    await MongoClient.connect(process.env.DATABASE_URL, (err, client) => {
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

export interface Options {
  numberOfEvents: number;
  numberOfTopMembers: number;
  curatorId: number;
}
interface Option<T> {
  value: T;
}
export async function findOption<K extends keyof Options>(
  name: K,
): Promise<Options[K] | undefined> {
  const { db } = await connectToDb();
  type T = Option<Options[K]>;
  // @ts-ignore
  const opt = await db.collection('settings').findOne<T>({ option: name });
  return opt?.value;
}
