import { Request, Response } from 'express';
import { MemberCheese } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Removes a cheeese badge with given cheese ID from member with given member ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const revokeCheeseFromMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionMemberCheese =
      db.collection<Omit<MemberCheese, '_id'>>('memberCheese');
    const { gameId, memberId } = req.params;

    /**
     * Remove cheese from member
     */
    const removedMemberCheese: MemberCheese | null =
      await collectionMemberCheese.findOne({
        gameId: Number(gameId),
        memberId,
      });

    if (!removedMemberCheese) {
      res.status(400).send({ error: 'This member does not have this cheese.' });
      return;
    }

    const responseCheeseRevoke = await collectionMemberCheese.deleteOne({
      gameId: Number(gameId),
      memberId,
    });

    if (!responseCheeseRevoke.acknowledged) {
      res
        .status(400)
        .send({ error: 'Could not remove this cheese from member.' });
    } else {
      res.status(200).send(responseCheeseRevoke);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
