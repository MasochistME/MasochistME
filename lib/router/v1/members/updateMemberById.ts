import { Request, Response } from 'express';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Updates a member with given member ID. All of the updatable fields are optional.
 * @param req Request
 * @param res Response
 * @returns void
 */
export const updateMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Member>('members');
    const { memberId } = req.params;
    const { description } = req.body; // TODO add validation

    const response = await collection.updateOne(
      { steamId: memberId },
      {
        $set: {
          ...(description && { description }),
        },
      },
    );

    client.close();

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update this member.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
