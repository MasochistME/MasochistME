import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from 'express';
import { Race, RacePlayer } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';
import {
  getParticipantRaceScore,
  sortPlayersByResult,
} from 'router/v1/race/__utils';

export const getRaceById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionRaces = db.collection<Race>('races');
    const collectionPlayers = db.collection<RacePlayer>('racePlayers');
    const { raceId } = req.params;
    const _id = new ObjectId(raceId);

    const race: Race | null = await collectionRaces.findOne({ _id });

    if (!race) {
      res.status(404).send({ error: 'Could not find the race with this id.' });
      return;
    }
    const cursorPlayers = await collectionPlayers.find({
      raceId,
    });

    const players: WithId<RacePlayer & { score: number }>[] = [];
    await cursorPlayers.forEach((player: RacePlayer) => {
      const score = getParticipantRaceScore(player, race);
      players.push({ ...player, score });
    });

    // TODO this needs to be adjusted a bit for score based races
    const leaderboards = sortPlayersByResult(race, players);

    res.status(200).send({
      ...race,
      participants: players,
      leaderboards,
    });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
