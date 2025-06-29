import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

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
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
