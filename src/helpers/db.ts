import { Db, MongoClient, WithId } from 'mongodb';

import { log } from 'helpers/log';

export const connectToDb = async (): Promise<{
  client: MongoClient;
  db: Db;
}> => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('No database URL provided');
    }
    const client = new MongoClient(url);
    return {
      client,
      db: client.db(process.env.ENV === 'dev' ? 'masochist-dev' : 'masochist'),
    };
  } catch (error: any) {
    log.WARN(error);
    throw error;
  }
};

export const getDataFromDB: any = async <T>(
  dataType: string,
  field?: Record<any, any>,
) => {
  const { client, db } = await connectToDb();
  const data = db.collection(dataType);
  const fieldToFind = field ? field : {};

  const dataFromDb: WithId<T>[] = [];
  const cursor = data.find(fieldToFind);
  await cursor.forEach((el: any) => {
    dataFromDb.push(el);
  });
  client.close();
  return dataFromDb;
};

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
