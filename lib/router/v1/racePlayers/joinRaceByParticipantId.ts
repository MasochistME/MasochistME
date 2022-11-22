import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { Race, RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';

export const joinRaceByParticipantId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const raceCollection = db.collection<Race>('races');
    const racePlayerCollection =
      db.collection<Omit<RacePlayer, '_id'>>('racePlayers');
    const { raceId, participantId: discordId } = req.params;

    try {
      new ObjectId(raceId);
    } catch (err) {
      res
        .status(400)
        .send({ error: 'The race ID your provided is incorrect.' });
      return;
    }

    const _id = new ObjectId(raceId);
    const race: Race | null = await raceCollection.findOne({ _id });

    if (!race) {
      res.status(404).send({ error: 'Could not find a race with given ID.' });
      return;
    }

    const newParticipant: Omit<RacePlayer, '_id'> = {
      discordId,
      raceId,
      type: race.type,
      startDate: null,
      endDate: null,
      dnf: false,
      proof: null,
      proofDate: null,
      ...(race.type === RaceType.SCORE_BASED && { score: null }),
    };

    const response = await racePlayerCollection.insertOne(newParticipant);

    if (!response.acknowledged) {
      res
        .status(400)
        .send({ error: 'Could not sign this user up for a race.' });
    } else {
      res.status(201).send(response);
    }
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
