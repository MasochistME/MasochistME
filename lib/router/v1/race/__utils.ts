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
    .map(player => ({
      ...player,
      score:
        race.type === RaceType.TIME_BASED
          ? dayjs.duration(player.score).format('H:mm:ss.SSS')
          : player.score ?? 0,
    }));
  const sortedPlayersWithPlace = sortedPlayers.map((player, index) => ({
    ...player,
    place: getPlayerPlace(sortedPlayers, index),
  }));
  return sortedPlayersWithPlace;
};

export const getPlayersPointsPerRace = (
  race: Race,
  allPlayers: RacePlayer[],
) => {
  const raceId = String(race._id);
  const racePlayers = allPlayers.filter(player => player.raceId === raceId);

  // We must add owner here so their points also contribute to sorting.
  const raceOwner = getRaceOwner(race);
  const playersWithOwner = [...racePlayers, raceOwner];
  const playersWithScore = playersWithOwner.map(player => ({
    ...player,
    score: getPlayerScore(race, player),
  }));
  const sortedPlayers = playersWithScore
    .sort((playerA, playerB) => {
      // If race is time based, wins person with lowest time;
      // otherwise person with highest score wins.
      if (race.type === RaceType.TIME_BASED)
        return (playerA.score as number) - (playerB.score as number);
      return (playerB.score as number) - (playerA.score as number);
    })
    .map((player, index: number) => ({
      raceId,
      discordId: player.discordId,
      points: getPlayerPlace(playersWithScore, index),
      dnf: player.dnf,
      disqualified: player.disqualified,
    }));

  // Here we also include players who participated in any race in the season,
  // but did not play this particular race.
  const uniqueParticipantIds = [
    ...new Set(allPlayers.map(player => player.discordId)),
  ];
  const notParticipatingPlayers = uniqueParticipantIds
    .filter(
      discordId =>
        !sortedPlayers.find(player => player.discordId === discordId),
    )
    .map(discordId => ({
      raceId,
      discordId,
      points: sortedPlayers.length,
      dnf: true,
      disqualified: false,
    }));

  return [...sortedPlayers, ...notParticipatingPlayers];
};

const getPlayerScore = (race: Race, player: Omit<RacePlayer, '_id'>) => {
  return race.type === RaceType.TIME_BASED
    ? player?.score
      ? dayjs.duration(player.score).format('H:mm:ss.SSS')
      : 0
    : player?.score ?? 0;
};

const getPlayerPlace = (
  players: (Omit<RacePlayer, '_id' | 'score'> & { score: string | number })[],
  index: number,
) => {
  const currPlayer = players[index];
  const prevPlayerIndex = players.findIndex(
    player => player.score === currPlayer.score,
  );
  // We check if there was a player with the same score higher on the leaderboards.
  // This player's index will always equal points, because even if it's the same
  // player, it will return their own index
  const place = prevPlayerIndex + 1;
  return place;
};
