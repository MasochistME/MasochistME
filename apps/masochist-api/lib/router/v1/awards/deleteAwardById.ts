import { Award, MemberAward } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';
import { ObjectId } from 'mongodb';

/**
 * Deletes an award with a given award ID, and removes it from all members that have it.
 * @param req Request
 * @param res Response
 * @return void
 */
export const deleteAwardById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionAwards = db.collection<Award>('awards');
    const collectionMemberAwards = db.collection<MemberAward>('memberAwards');
    const _id = new ObjectId(req.params.awardId);

    const responseAwards = await collectionAwards.deleteOne({ _id });
    const responseMemberAwards = await collectionMemberAwards.deleteMany({
      awardId: String(_id),
    });

    if (!responseAwards.acknowledged || !responseMemberAwards.acknowledged) {
      res.status(404).send({ error: 'Could not delete the award.' });
    } else {
      res.status(200).send(responseAwards);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
