import { Request, Response } from 'express';
import { Badge } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all badges belonging to a game with given ID.
 * @param req Request
 * @param res Response
 * @return void
 */
export const getBadgesByGameId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<Badge>('badges');
    const { gameId } = req.params;

    const cursor = collection.find({ gameId: Number(gameId) });
    const badges: Badge[] = [];

    await cursor.forEach((el: Badge) => {
      badges.push(el);
    });

    client.close();

    res.status(200).send(badges);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
