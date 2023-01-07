import { WithId } from 'mongodb';
import { Request, Response } from 'express';
import { Race, RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { RaceListParams } from '@masochistme/sdk/dist/v1/api/races';

import { log } from 'helpers/log';
import { sortCollection } from 'helpers/db';
import { mongoInstance } from 'index';
import { getParticipantRaceScore } from 'router/v1/race/__utils';

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

    // get all race participants
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
      if (r.isActive) return r;
      const raceParticipants = players.filter(p => p.raceId === String(r._id));
      const summary = {
        signups: raceParticipants.length,
        participants:
          raceParticipants.filter(p => !p.dnf && !p.disqualified)?.length ?? 0,
        dnf: raceParticipants.filter(p => p.dnf || p.disqualified)?.length ?? 0,
        winner: raceParticipants[0]?.discordId ?? null,
      };
      return { ...r, summary };
    });

    res.status(200).send(racesWithSummary);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
