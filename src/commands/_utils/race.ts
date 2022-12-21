import { Race, RacePlayer, RaceType } from "@masochistme/sdk/dist/v1/types";
import { DiscordInteraction, getErrorEmbed, log } from "arcybot";
import dayjs from "dayjs";

import { RACE_TIMEOUT, RACE_RESULTS_TIMEOUT } from "consts";
import { getDateFromDelay, getModChannel, getTimestampFromDate } from "utils";
import { sdk } from "fetus";

import { RaceData } from "commands/racesetup/logic";
import { raceReadyToGo } from "commands/racesetup/interactions/playerActions";
import { raceFinalize } from "commands/racesetup/interactions/raceFinalize";

/**
 * Executes every minute to check if any race needs to be started or finished.
 */
export const handleRaceTimer = async () => {
  try {
    const activeRaces = await sdk.getRaceList({});
    activeRaces.forEach(async (race: Race) => {
      await handleRaceStart(race);
      await handleRaceFinish(race);
    });
  } catch (err: any) {
    log.WARN(err);
    getModChannel(true)?.send(
      getErrorEmbed(
        "ERROR - RACE TIMER",
        "There was something wrong trying to check the race status.",
      ),
    );
  } finally {
    setTimeout(handleRaceTimer, RACE_TIMEOUT);
  }
};

/**
 * Opens an inactive race if the time is up.
 * @param race Race
 * @return void
 */
const handleRaceStart = async (race: Race) => {
  const { name, startDate, endDate, isActive, _id } = race;
  const raceId = String(_id);
  const raceShouldStart =
    !isActive &&
    dayjs(startDate).diff(new Date()) <= 0 &&
    dayjs(endDate).diff(new Date()) > 0;
  if (!raceShouldStart) return;
  log.INFO("Detected a race to begin...");
  const response = await sdk.updateRaceById({
    raceId,
    race: { isActive: true },
  });
  if (!response.acknowledged) {
    getModChannel(true)?.send(
      getErrorEmbed(
        "ERROR - RACE STARTING...",
        `Race **${name.toUpperCase()}** should start right now, but something fucked up and it could not start.`,
      ),
    );
  }
  raceReadyToGo(raceId);
};

/**
 * Expires an active race if the time is up.
 * @param race Race
 * @return void
 */
const handleRaceFinish = async (race: Race) => {
  const { name, startDate, endDate, isActive, _id } = race;
  const raceId = String(_id);
  const raceShouldEnd =
    isActive &&
    dayjs(startDate).diff(new Date()) <= 0 &&
    dayjs(endDate).diff(new Date()) <= 0;
  if (!raceShouldEnd) return;
  log.INFO("Detected a race to end...");
  const response = await sdk.updateRaceById({
    raceId,
    race: { isActive: false },
  });
  if (!response.acknowledged) {
    getModChannel(true)?.send(
      getErrorEmbed(
        "ERROR - RACE FINISHING...",
        `Race **${name.toUpperCase()}** should finish right now, but something fucked up and it could not finish.`,
      ),
    );
  }
  // setTimeout(() => {
  raceFinalize(raceId);
  // }, RACE_RESULTS_TIMEOUT);
};

/**
 * Draft race - after it's set up by moderator but before it's confirmed
 */
export const draftRace: { race: Omit<Race, "_id" | "isActive"> | null } = {
  race: null,
};

/**
 * Saves or clears the draft race.
 * @param race Omit<Race, "_id">
 */
export const setDraftRace = (race?: Omit<Race, "_id" | "isActive">) => {
  if (race) draftRace.race = race;
  else draftRace.race = null;
};

/**
 * Returns draft race if it exists, or null if it does not.
 * @return Omit<Race, "_id"> | null
 */
export const getDraftRace = (): Omit<Race, "_id" | "isActive"> | null => {
  return draftRace.race;
};

/**
 *
 * @param interaction DiscordInteraction
 * @param raceData RaceData
 * @return Omit<Race, "_id">
 */
export const getRace = (raceData: RaceData) => {
  return {
    name: raceData.name,
    instructions: raceData.instructions,
    objectives: raceData.objectives,
    type: raceData.playLimit ? RaceType.SCORE_BASED : RaceType.TIME_BASED,
    startDate: getDateFromDelay(raceData.startsIn),
    endDate: getDateFromDelay(raceData.startsIn + raceData.endsAfter),
    downloadLink: raceData.downloadLink,
    downloadGrace: raceData.downloadGrace,
    uploadGrace: raceData.uploadGrace,
    owner: raceData.owner,
    ownerTime: raceData.ownerTime,
    season: raceData.season,
    ...(raceData.icon && { icon: raceData.icon }),
    ...(raceData.playLimit && { playLimit: raceData.playLimit }),
  };
};

/**
 * Gets time of a race player, taking all the grace periods into consideration
 * @param raceParticipant RacePlayer
 */
export const getParticipantRaceTime = (
  raceParticipant: RacePlayer,
  race: Race,
) => {
  const { revealDate, startDate, endDate, proofDate } = raceParticipant;
  const { uploadGrace, downloadGrace } = race;

  const reveal = getTimestampFromDate(revealDate);
  const start = getTimestampFromDate(startDate);
  const end = getTimestampFromDate(endDate);
  const proof = getTimestampFromDate(proofDate);

  const download = downloadGrace * 1000;
  const upload = uploadGrace * 1000;

  const downloadPenalty =
    start - reveal > download ? -download + (start - reveal) : 0;
  const uploadPenalty = proof - end > upload ? -upload + (proof - end) : 0;
  const fullTime = end - start + downloadPenalty + uploadPenalty;

  return { downloadTime: start - reveal, uploadTime: proof - end, fullTime };
};
