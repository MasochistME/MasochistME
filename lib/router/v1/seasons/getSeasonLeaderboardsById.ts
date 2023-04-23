import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from 'express';
import { Race, RacePlayer, Season } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';
import {
  getParticipantRaceScore,
  getPlayersPointsPerRace,
} from 'router/v1/race/__utils';

export const getSeasonLeaderboardsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { db } = mongoInstance.getDb();
    const collectionSeasons = db.collection<Season>('seasons');
    const { seasonId } = req.params;

    const season: Season | null = await collectionSeasons.findOne({
      _id: new ObjectId(seasonId),
    });

    if (!season) {
      res
        .status(404)
        .send({ error: 'Could not find the season with this id.' });
      return;
    }

    // Get a list of all race IDs associated with that season
    const races: Race[] = [];
    const collectionRaces = db.collection<Race>('races');
    const cursorRaces = await collectionRaces.find({ season: seasonId });
    await cursorRaces.forEach((race: Race) => {
      races.push(race);
    });
    const raceIds: string[] = races.map(r => String(r._id));

    // Get all the race players from this season
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

    // Sort all the race participants by the place they have gotten in their respective race
    const seasonLeaderboards = races
      .filter(r => !r.isActive && r.isDone)
      .map(r => getPlayersPointsPerRace(r, players))
      .flat();

    // at the very end
    res.status(200).send(seasonLeaderboards);
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
