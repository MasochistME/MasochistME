import { Race, RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { Request, Response } from 'express';
import { log } from 'helpers/log';

export const updateRaceByParticipantId = async (
  req: Request<any, Partial<Omit<Race, '_id'>>>,
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
      res.status(404).send({ error: 'Could not find the user to update.' });
      return;
    }

    const {
      revealDate,
      startDate,
      endDate,
      proofDate,
      score,
      dnf,
      proof,
      disqualified,
      warningsLeft,
    } = req.body; // TODO Add Request<RacePlayer> body validation

    const response = await collection.updateOne(
      { _id: racePlayer._id },
      {
        $set: {
          ...(revealDate && { revealDate: new Date(revealDate) }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(proofDate && { proofDate: new Date(proofDate) }),
          ...(score && { score: Number(score) }),
          ...(dnf !== undefined && { dnf }),
          ...(disqualified !== undefined && { disqualified }),
          ...(proof && { proof }),
          ...(warningsLeft !== undefined && { warningsLeft }),
        },
      },
    );

    if (!response.acknowledged) {
      res.status(400).send({ error: 'Could not update the user.' });
    } else {
      res.status(200).send(response);
    }
  } catch (err: unknown) {
    log.ERROR(err);
    res.status(500).send({ error: err ?? 'Internal server error' });
  }
};
