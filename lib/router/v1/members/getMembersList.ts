import { Request, Response } from 'express';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all members stored in the database.
 * @param _req Request
 * @param res Response
 * @returns void
 */
export const getMembersList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Member>('members');
    const cursor = collection.find();
    const members: Member[] = [];

    await cursor.forEach((el: Member) => {
      members.push(el);
    });

    client.close();

    res.status(200).send(members);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
