import { ObjectId, WithId } from 'mongodb';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { Race, RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { getTimestampFromDate } from 'helpers';
import { mongoInstance } from 'index';

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
      .sort((playerA, playerB) => playerA.score - playerB.score)
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

/**
 * Returns participant's time in miliseconds
 * @param raceParticipant
 * @param race
 * @returns
 */
const getParticipantRaceScore = (raceParticipant: RacePlayer, race: Race) => {
  const {
    revealDate,
    startDate,
    endDate,
    proofDate,
    score = 0,
  } = raceParticipant;
  const { uploadGrace, downloadGrace, type } = race;

  if (type === RaceType.SCORE_BASED) return score as number;

  const reveal = getTimestampFromDate(revealDate);
  const start = getTimestampFromDate(startDate);
  const end = getTimestampFromDate(endDate);
  const proof = getTimestampFromDate(proofDate);

  const download = downloadGrace * 1000;
  const upload = uploadGrace * 1000;

  const downloadPenalty = start - reveal > download ? download : 0;
  const uploadPenalty = proof - end > upload ? upload : 0;
  const fullTime = end - start + downloadPenalty + uploadPenalty;

  return fullTime;
};
