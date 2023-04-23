import { Request, Response } from 'express';
import { MemberAward } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Gives an award with given award ID to member with given member ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const giveAwardToMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionMemberAwards =
      db.collection<Omit<MemberAward, '_id'>>('memberAwards');
    const { awardId, memberId } = req.params;

    /**
     * Give member an award
     */
    const memberAward: MemberAward | null =
      await collectionMemberAwards.findOne({
        awardId,
        memberId,
      });

    if (memberAward) {
      res.status(400).send({ error: 'This user already has this award.' });
      return;
    }

    const newMemberAward: Omit<MemberAward, '_id'> = {
      awardId,
      memberId,
      unlocked: new Date(),
    };

    const responseAwardGrant = await collectionMemberAwards.insertOne(
      newMemberAward,
    );

    if (!responseAwardGrant.acknowledged) {
      res.status(400).send({ error: 'Could not give this award to member.' });
    } else {
      res.status(201).send(responseAwardGrant);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
