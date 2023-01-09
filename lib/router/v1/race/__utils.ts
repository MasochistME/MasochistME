import { WithId } from 'mongodb';
import dayjs from 'dayjs';
import { Race, RacePlayer, RaceType } from '@masochistme/sdk/dist/v1/types';

import { getTimestampFromDate } from 'helpers';

/**
 * Returns participant's time in miliseconds
 * @param raceParticipant
 * @param race
 * @returns
 */
export const getParticipantRaceScore = (
  raceParticipant: RacePlayer,
  race: Race,
) => {
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

  const downloadTime = start - reveal;
  const uploadTime = proof - end;

  const downloadPenalty = downloadTime > download ? downloadTime : 0;
  const uploadPenalty = uploadTime > upload ? uploadTime : 0;
  const fullTime = end - start + downloadPenalty + uploadPenalty;

  return fullTime;
};

/**
 *
 * @returns
 */
export const getRaceOwner = (race: Race) => {
  const raceOwner = {
    raceId: String(race._id),
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
    score: getRaceOwnerScore(race),
  };
  return raceOwner;
};

/**
 *
 * @returns
 */
export const getRaceOwnerScore = (race: Race) => {
  if (race.type === RaceType.TIME_BASED)
    return race?.ownerTime ? race?.ownerTime * 1000 : 0;
  if (race.type === RaceType.SCORE_BASED) return race?.ownerScore ?? 0;
  return 0;
};

/**
 *
 * @param race
 * @param players
 * @param raceOwner
 * @returns
 */
export const sortPlayersByResult = (
  race: Race,
  players: (RacePlayer & { score: number })[],
) => {
  const raceOwner = getRaceOwner(race);
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
            ? dayjs.duration(player.score).format('H:mm:ss.SSS')
            : player.score ?? 0,
      };
    });
  return sortedPlayers;
};

/**
 *
 * @param race
 * @param players
 * @returns
 */
export const getPlayersPointsPerRace = (
  race: Race,
  players: (RacePlayer & { score: number })[],
) => {
  const raceOwner = getRaceOwner(race);
  const allPlayers = [...players, raceOwner];
  const sortedPlayers = allPlayers
    .filter(player => !player.dnf && !player.disqualified)
    .sort((playerA, playerB) => {
      // If race is time based, wins person with lowest time;
      // otherwise person with highest score wins.
      if (race.type === RaceType.TIME_BASED)
        return playerA.score - playerB.score;
      return playerB.score - playerA.score;
    })
    .map((player, index: number) => ({
      raceId: player.raceId,
      discordId: player.discordId,
      points: index,
    }));
  const disqualifiedPlayers = allPlayers
    .filter(player => player.dnf || player.disqualified)
    .map(player => ({
      raceId: player.raceId,
      discordId: player.discordId,
      points: sortedPlayers.length,
    }));
  const allPlayersWithPoints = [...sortedPlayers, ...disqualifiedPlayers];
  return allPlayersWithPoints;
};
