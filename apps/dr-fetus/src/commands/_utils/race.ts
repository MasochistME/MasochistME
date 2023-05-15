import {
  Race,
  RacePlayer,
  RacePlayerScore,
  RaceScoreBased,
  RaceTimeBased,
  RaceType,
} from "@masochistme/sdk/dist/v1/types";
import { getErrorEmbed, getInfoEmbed, log } from "arcybot";
import dayjs from "dayjs";

import { RACE_TIMEOUT, RACE_RESULTS_TIMEOUT, Room } from "consts";
import {
  getChannelByKey,
  getDateFromDelay,
  getDMChannel,
  getModChannel,
  getTimestampFromDate,
} from "utils";
import { bot, sdk } from "fetus";

import { RaceData } from "commands/racesetup/logic";
import { raceReadyToGo } from "commands/racesetup/interactions/playerActions";
import { raceFinalize } from "commands/racesetup/interactions/raceFinalize";

/**
 * Executes every minute to check if any race needs to be started or finished.
 */
export const handleRaceTimer = async () => {
  try {
    const allRaces = await sdk.getRaceList({});
    allRaces.forEach(async (race: Race) => {
      await handleRaceStart(race);
      await handleRaceFinish(race);
      if (race.type === RaceType.SCORE_BASED) await handleScoreRace(race);
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
  const { startDate, endDate, isActive, isDone, _id } = race;
  const raceId = String(_id);
  const raceEnded =
    dayjs(startDate).diff(new Date()) <= 0 &&
    dayjs(endDate).diff(new Date()) <= 0;
  const raceEndPeriodEnded =
    -1 * dayjs(endDate).diff(new Date()) >= RACE_RESULTS_TIMEOUT;

  const raceShouldEnterEndPeriod = raceEnded && isActive && !isDone;
  const raceShouldEnd = raceEnded && !isActive && !isDone && raceEndPeriodEnded;

  if (raceShouldEnterEndPeriod) {
    log.INFO(
      `Race ends - entering the ${RACE_RESULTS_TIMEOUT}ms long grace period...`,
    );
    try {
      getChannelByKey(Room.RACE_CURRENT)?.send(
        getInfoEmbed(
          "RACE FINISHING SOON",
          `You cannot join the race anymore, but if you are in the middle of your run, you still have ${RACE_RESULTS_TIMEOUT}ms to finish. After that time the race is closed and the results will get posted.`,
        ),
      );
    } catch (e) {
      log.WARN("Sending the warning about race ending failed!");
      console.log(e);
    }
    const response = await sdk.updateRaceById({
      raceId,
      race: { isActive: false },
    });
    if (!response.acknowledged) {
      getModChannel(true)?.send(
        getErrorEmbed(
          "ERROR - RACE FINISHING...",
          `Race **${race?.name}** should finish right now, but something fucked up and it could not finish.`,
        ),
      );
    }
  } else if (raceShouldEnd) {
    raceFinalize(raceId);
  }
};

/**
 * Handle participants playing a score based race.
 * @param race RaceScoreBased
 */
const handleScoreRace = async (race: RaceScoreBased) => {
  const raceId = String(race._id);
  const raceParticipants = (await sdk.getRaceParticipantsList({
    raceId,
    filter: { dnf: false },
  })) as RacePlayerScore[];
  await handleScoreRaceWarn(
    race,
    raceParticipants.filter(p => p.startDate && !p.endDate && !p.isWarned),
  );
  await handleScoreRaceDNF(
    race,
    raceParticipants.filter(p => p.startDate && !p.endDate && p.isWarned),
  );
};

/**
 * Warn race players which are still playing.
 * @param race RaceScoreBased
 * @param raceParticipants RacePlayerScore[]
 */
const handleScoreRaceWarn = async (
  race: RaceScoreBased,
  raceParticipants: RacePlayerScore[],
) => {
  try {
    const { playLimit, warningPeriod, _id } = race;
    const raceId = String(_id);

    raceParticipants.forEach(async participant => {
      const participantPlayTime =
        getTimestampFromDate(new Date()) -
        getTimestampFromDate(participant.startDate);
      const shouldPlayerBeWarned =
        playLimit * 1000 - participantPlayTime <= warningPeriod * 1000;
      if (shouldPlayerBeWarned) {
        await getDMChannel(participant.discordId)?.send(
          getInfoEmbed(
            "Your race attempt ends soon",
            `You have ${
              warningPeriod / 60
            } minutes left before the end of your run.
              \n**You need to physically click the END button before the race timer runs out.** If you forget to do this, you'll get DNF.
              \n[DEBUG] Timestamp: \`\`${getTimestampFromDate(new Date())}\`\``,
          ),
        );
        const { acknowledged } = await sdk.updateRaceByParticipantId({
          raceId,
          memberId: participant.discordId,
          update: { isWarned: true } as Partial<
            Omit<RacePlayerScore, "_id" | "type">
          >,
        });
        if (!acknowledged)
          throw `Participant <@${participant.discordId}> has been warned but I could not update them in the database.`;
      }
    });
  } catch (err: any) {
    getModChannel(true)?.send(
      getErrorEmbed("ERROR - WARNING PARTICIPANT...", err),
    );
  }
};

/**
 * Disqualify race players which forgot to click END button.
 * @param race RaceScoreBased
 * @param raceParticipants RacePlayerScore[]
 */
const handleScoreRaceDNF = async (
  race: RaceScoreBased,
  raceParticipants: RacePlayerScore[],
) => {
  try {
    const { playLimit, _id } = race;
    const raceId = String(_id);
    const botId = bot.botClient.user?.id;

    raceParticipants.forEach(async participant => {
      const participantPlayTime =
        getTimestampFromDate(new Date()) -
        getTimestampFromDate(participant.startDate);
      const shouldPlayerBeDisqualified = participantPlayTime > playLimit * 1000;
      if (shouldPlayerBeDisqualified) {
        await getDMChannel(participant.discordId)?.send(
          getErrorEmbed(
            "Your timer ran out",
            `The time of your run has ended and you didn't physically click the END button, therefore you got disqualified.
              \n[DEBUG] Timestamp: \`\`${getTimestampFromDate(new Date())}\`\``,
          ),
        );
        const update = {
          dnf: true,
          disqualified: true,
          disqualifiedBy: botId,
          disqualificationReason: "Timer run out",
        } as Partial<Omit<RacePlayerScore, "_id" | "type">>;
        const { acknowledged } = await sdk.updateRaceByParticipantId({
          raceId,
          memberId: participant.discordId,
          update,
        });
        if (!acknowledged)
          throw `Participant <@${participant.discordId}> could not get disqualified even though they should, pls fix.`;
        getModChannel(true)?.send(
          getErrorEmbed(
            `Player disqualified`,
            `Player **<@${
              participant.discordId
            }>** got disqualified from race by **<@${botId}>**.
              \n**Race:** ${race.name}\n**Reason:** _${
              update.disqualificationReason
            }_\n**Date:** ${new Date().toLocaleString()}`,
          ),
        );
      }
    });
  } catch (err: any) {
    getModChannel(true)?.send(
      getErrorEmbed("ERROR - WARNING PARTICIPANT...", err),
    );
  }
};

/**
 * Draft race - after it's set up by moderator but before it's confirmed
 */
export const draftRace: {
  race: Omit<Race, "_id" | "isActive" | "isDone"> | null;
} = {
  race: null,
};

/**
 * Saves or clears the draft race.
 * @param race Omit<Race, "_id">
 */
export const setDraftRace = (
  race?: Omit<Race, "_id" | "isActive" | "isDone">,
) => {
  if (race) draftRace.race = race;
  else draftRace.race = null;
};

/**
 * Returns draft race if it exists, or null if it does not.
 * @return Omit<Race, "_id"> | null
 */
export const getDraftRace = (): Omit<
  Race,
  "_id" | "isActive" | "isDone"
> | null => {
  return draftRace.race;
};

/**
 *
 * @param interaction DiscordInteraction
 * @param raceData RaceData
 * @return Omit<Race, "_id">
 */
export const getRace = (raceData: RaceData<RaceScoreBased | RaceTimeBased>) => {
  const { startsIn, endsAfter, ...raceDataRest } = raceData;
  return {
    ...raceDataRest,
    startDate: getDateFromDelay(startsIn),
    endDate: getDateFromDelay(startsIn + endsAfter),
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

  const downloadTime = start - reveal;
  const uploadTime = proof - end;

  const downloadPenalty = downloadTime > download ? downloadTime : 0;
  const uploadPenalty = uploadTime > upload ? uploadTime : 0;
  const fullTime = end - start + downloadPenalty + uploadPenalty;

  return { downloadTime, uploadTime, fullTime };
};

/**
 * Returns a medal emoji if someone won a race
 * @param place number
 * @returns medal lol
 */
export const getMedal = (place: number) => {
  if (place === 0) return "🥇";
  if (place >= 1 && place < 3) return "🥈";
  if (place >= 3 && place < 6) return "🥉";
  return "";
};
