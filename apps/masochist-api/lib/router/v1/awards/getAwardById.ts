import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Award } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

/**
 * Returns an award by the given ID (if it exists).
 * @param req Request
 * @param res Response
 * @return void
 */
export const getAwardById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<Award>('awards');
    const _id = new ObjectId(req.params.awardId);

    const award: Award | null = await collection.findOne({ _id });

    if (!award) {
      res.status(404).send({ error: 'Could not find an award with this id.' });
      return;
    }

    // Award has no children, just send it
    if (!award.children?.length) {
      res.status(200).send(award);
      return;
    }

    // Award has children, get them
    const awardChildren: Award[] = [];
    const cursorChildren = collection.find({
      $or: award.children.map(childId => ({ _id: new ObjectId(childId) })),
    });
    await cursorChildren.forEach((award: Award) => {
      awardChildren.push(award);
    });
    res.status(200).send({ ...award, children: awardChildren });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
