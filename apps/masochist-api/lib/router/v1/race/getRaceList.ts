import { WithId } from 'mongodb';
import { Request, Response } from 'express';
import { Race, RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { RaceListParams } from '@masochistme/sdk/dist/v1/api/races';

import { log } from 'helpers/log';
import { sortCollection } from 'helpers/db';
import { mongoInstance } from 'api';
import {
  getParticipantRaceScore,
  sortPlayersByResult,
} from 'router/v1/race/__utils';

/**
 * Returns a list of all races stored in the database.
 */
export const getRaceList = async (
  req: Request<any, any, RaceListParams>,
  res: Response,
): Promise<void> => {
  try {
    const { filter = {}, sort = {}, limit = 1000 } = req.body;

    const { db } = mongoInstance.getDb();

    // get all the races by filter
    const collectionRaces = db.collection<Race>('races');
    const races: Race[] = [];
    const cursorRaces = collectionRaces
      .find(filter)
      .sort({
        ...(sort.season && { season: sortCollection(sort.season) }),
        ...(sort.startDate && { startDate: sortCollection(sort.startDate) }),
        ...(sort.endDate && { endDate: sortCollection(sort.endDate) }),
      })
      .limit(limit);
    await cursorRaces.forEach((el: Race) => {
      races.push(el);
    });
    const raceIds = races.map(r => String(r._id));

    // // get all race participants
    const collectionPlayers = db.collection<RacePlayer>('racePlayers');
    const players: WithId<RacePlayer & { score: number }>[] = [];
    const cursorPlayers = await collectionPlayers.find({
      raceId: { $in: raceIds },
    });
    await cursorPlayers.forEach((player: RacePlayer) => {
      const race = races.find(r => String(r._id) === player.raceId);
      if (!race) return;
      const score = getParticipantRaceScore(player, race);
      players.push({ ...player, score });
    });

    // aggregate all the data together
    const racesWithSummary = races.map(r => {
      if (r.isActive || !r.isDone) return r;

      const signups = players.filter(p => p.raceId === String(r._id));
      const participantsFinished = sortPlayersByResult(r, signups);
      const dnf = signups.filter(p => p.dnf || p.disqualified);
      const winner = participantsFinished[0]?.discordId ?? null;

      const summary = {
        signups: signups.length ?? 0,
        participants: participantsFinished?.length ?? 0,
        dnf: dnf?.length ?? 0,
        winner,
        list: participantsFinished.map(p => p.discordId),
      };
      return { ...r, summary };
    });

    res.status(200).send(racesWithSummary);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
