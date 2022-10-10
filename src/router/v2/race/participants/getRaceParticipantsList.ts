import { Request, Response } from 'express';
import { RacePlayer } from '@masochistme/sdk/dist/v2/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

/**
 * Returns a list of all participants of a race.
 * @param req
 * @param res
 */
export const getRaceParticipantsList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { client, db } = await connectToDb();
    const collection = db.collection<RacePlayer>('racePlayers');
    const { raceid: raceId } = req.params;

    const cursor = collection.find({ raceId });
    const racePlayers: RacePlayer[] = [];

    await cursor.forEach((el: RacePlayer) => {
      racePlayers.push(el);
    });

    client.close();

    res.status(200).send(racePlayers);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
