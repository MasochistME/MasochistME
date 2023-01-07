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

  const downloadPenalty = start - reveal > download ? download : 0;
  const uploadPenalty = proof - end > upload ? upload : 0;
  const fullTime = end - start + downloadPenalty + uploadPenalty;

  return fullTime;
};
