import { Request, Response } from 'express';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns a member by the given ID (if it exists).
 * @param req Request
 * @param res Response
 * @return void
 */
export const getMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Member>('members');
    const { memberId } = req.params;

    const memberSteam: Member | null = await collection.findOne({
      steamId: memberId,
    });
    const memberDiscord: Member | null = await collection.findOne({
      discordId: memberId,
    });

    if (!memberSteam && !memberDiscord) {
      res.status(404).send({ error: 'Could not find a member with this id.' });
    } else {
      res.status(200).send(memberSteam ?? memberDiscord);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
