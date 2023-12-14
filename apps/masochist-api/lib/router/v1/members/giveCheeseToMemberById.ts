import { Request, Response } from 'express';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';
import { MemberCheese } from '@masochistme/sdk/lib/v1/types';

/**
 * Gives a cheese badge to member with given member ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const giveCheeseToMemberById = async (
  req: Request<MemberCheese>,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionMemberCheese =
      db.collection<Omit<MemberCheese, '_id'>>('memberCheese');
    const { memberId } = req.params;

    const memberCheeseBadge: Omit<MemberCheese, '_id'> = {
      ...req.body,
      memberId,
      unlocked: new Date(),
    };

    const responseCheeseGrant = await collectionMemberCheese.insertOne(
      memberCheeseBadge,
    );

    if (!responseCheeseGrant.acknowledged) {
      res.status(400).send({ error: 'Could not give this cheese to member.' });
    } else {
      res.status(201).send(responseCheeseGrant);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
