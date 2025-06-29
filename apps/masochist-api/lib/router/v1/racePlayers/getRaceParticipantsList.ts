import { RaceParticipantsListParams } from '@masochistme/sdk/dist/v1/api/racePlayers';
import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { sortCollection } from 'helpers/db';
import { log } from 'helpers/log';

/**
 * Returns a list of all participants of a race.
 */
export const getRaceParticipantsList = async (
  req: Request<any, any, RaceParticipantsListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;
    const { raceId } = req.params;

    const { db } = mongoInstance.getDb();
    const collection = db.collection<RacePlayer>('racePlayers');
    const racePlayers: RacePlayer[] = [];

    const cursor = collection
      .find({ raceId, ...filter })
      .sort({
        ...(sort.startDate && { startDate: sortCollection(sort.startDate) }),
        ...(sort.endDate && { endDate: sortCollection(sort.endDate) }),
        ...(sort.score && { score: sortCollection(sort.score) }),
      })
      .limit(limit);

    await cursor.forEach((el: RacePlayer) => {
      racePlayers.push(el);
    });

    res.status(200).send(racePlayers);
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
