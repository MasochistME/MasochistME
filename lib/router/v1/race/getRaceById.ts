import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { Race, RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'index';
import { getParticipantRaceScore } from 'router/v1/race/__utils';

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

    const getOwnerScore = () => {
      if (race.type === RaceType.TIME_BASED)
        return race?.ownerTime ? race?.ownerTime * 1000 : 0;
      if (race.type === RaceType.SCORE_BASED) return race?.ownerScore ?? 0;
      return 0;
    };

    const raceOwner = {
      raceId,
      discordId: race.owner,
      type: race.type,
      startDate: null,
      endDate: null,
      revealDate: null,
      proofDate: null,
      proof: null,
      dnf: false,
      disqualified: false,
      disqualifiedBy: null,
      disqualificationReason: null,
      score: getOwnerScore(),
    };

    // TODO this currently only works for time based races!
    const sortedPlayers = [...players, raceOwner]
      .filter(player => !player.dnf && !player.disqualified)
      .sort((playerA, playerB) => {
        // If race is time based, wins person with lowest time;
        // otherwise person with highest score wins.
        if (race.type === RaceType.TIME_BASED)
          return playerA.score - playerB.score;
        return playerB.score - playerA.score;
      })
      .map(player => {
        return {
          ...player,
          score:
            race.type === RaceType.TIME_BASED
              ? dayjs.duration(player.score).format('m:ss.SSS')
              : player.score ?? 0,
        };
      });
    res.status(200).send({
      ...race,
      participants: players,
      leaderboards: sortedPlayers,
    });
  } catch (err: any) {
    log.WARN(err);
    res.status(500).send({ error: err.message ?? 'Internal server error' });
  }
};
