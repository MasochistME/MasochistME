import { Request, Response } from 'express';
import { RacePlayer } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

/**
 * Returns a race participant (if it exists).
 * @param req Request
 * @param res Response
 */
export const getRaceParticipantById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collection = db.collection<RacePlayer>('racePlayers');
    const { raceId, participantId: discordId } = req.params;

    const racePlayer: RacePlayer | null = await collection.findOne({
      raceId,
      discordId,
    });

    if (!racePlayer) {
      res.status(404).send({
        error: 'Could not find a player with this id in this particular race.',
      });
    } else {
      res.status(200).send(racePlayer);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
