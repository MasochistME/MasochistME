import { MemberAward } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

/**
 * Removes an award with given award ID from member with given member ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const revokeAwardFromMemberById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionMemberAwards =
      db.collection<Omit<MemberAward, '_id'>>('memberAwards');
    const { awardId, memberId } = req.params;

    /**
     * Remove award from member
     */
    const removedMemberAward: MemberAward | null =
      await collectionMemberAwards.findOne({
        awardId,
        memberId,
      });

    if (!removedMemberAward) {
      res.status(400).send({ error: 'This member does not have this award.' });
      return;
    }

    const responseAwardRevoke = await collectionMemberAwards.deleteOne({
      awardId,
      memberId,
    });

    if (!responseAwardRevoke.acknowledged) {
      res
        .status(400)
        .send({ error: 'Could not remove this award from member.' });
    } else {
      res.status(200).send(responseAwardRevoke);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
