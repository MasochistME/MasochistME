import { Race, RaceType } from "@masochistme/sdk/dist/v1/types";
import { DiscordInteraction } from "arcybot";

import { getDateFromDelay } from "utils/getDate";
import { RaceData } from "commands/racesetup/logic";

export const draftRace: { race: Omit<Race, "_id"> | null } = { race: null };

export const setDraftRace = (race?: Omit<Race, "_id">) => {
  if (race) draftRace.race = race;
  else draftRace.race = null;
};

export const getDraftRace = () => {
  return draftRace.race;
};

export const getRace = (
  interaction: DiscordInteraction,
  raceData: RaceData,
): Omit<Race, "_id"> => {
  return {
    name: raceData.name,
    instructions: raceData.instructions,
    objectives: raceData.objectives,
    type: raceData.playLimit ? RaceType.SCORE_BASED : RaceType.TIME_BASED,
    startTime: getDateFromDelay(raceData.startsIn),
    endTime: getDateFromDelay(raceData.startsIn + raceData.endsAfter),
    downloadLink: raceData.downloadLink,
    downloadGrace: raceData.downloadGrace,
    uploadGrace: raceData.uploadGrace,
    organizer: interaction.user.id,
    isActive: false,
    ...(raceData.icon && { icon: raceData.icon }),
    ...(raceData.playLimit && { playLimit: raceData.playLimit }),
  };
};
