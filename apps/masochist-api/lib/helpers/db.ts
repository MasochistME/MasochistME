import { Db, MongoClient, WithId, SortDirection } from 'mongodb';

import { log } from 'helpers/log';
import { Sort } from '@masochistme/sdk/dist/v1/types';

export class MongoInstance {
  public client: MongoClient;
  public db: Db;

  constructor() {
    try {
      const url = process.env.DATABASE_URL;
      if (!url) {
        throw new Error('No database URL provided');
      }
      this.client = new MongoClient(url);
      this.db = this.client.db(
        process.env.ENV === 'dev' ? 'masochist-dev' : 'masochist',
      );
    } catch (error: any) {
      log.WARN(error);
      throw error;
    }
  }

  getDb() {
    return { db: this.db };
  }
}

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

export const sortCollection = (sort: Sort | undefined): SortDirection => {
  if (sort === 'desc') return -1;
  return 1;
};

export const getDataFromDB: any = async <T>(
  dataType: string,
  field?: Record<any, any>,
) => {
  const { db } = await connectToDb();
  const data = db.collection(dataType);
  const fieldToFind = field ? field : {};

  const dataFromDb: WithId<T>[] = [];
  const cursor = data.find(fieldToFind);
  await cursor.forEach((el: any) => {
    dataFromDb.push(el);
  });

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
