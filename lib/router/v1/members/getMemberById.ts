import { Request, Response } from 'express';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a member by the given ID (if it exists).
 * @param req Request
 * @param res Response
 * @returns void
 */
export const getMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Member>('members');
    const { memberId } = req.params;

    const member: Member | null = await collection.findOne({
      steamId: memberId,
    });

    client.close();

    if (!member) {
      res.status(404).send({ error: 'Could not find a member with this id.' });
    } else {
      res.status(200).send(member);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
