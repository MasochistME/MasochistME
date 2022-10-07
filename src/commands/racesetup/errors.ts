import { DiscordInteraction, getErrorEmbed } from "arcybot";

import { RaceData } from "./logic";

/**
 * Handles error caused by race ending before it starts.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const errorEndsBeforeStart = (interaction: DiscordInteraction) => {
  interaction.reply(
    getErrorEmbed(
      "Error",
      "A race can _not_ have a later start date than end date, you moron.",
    ),
  );
  return;
};

/**
 * Handles error caused by race being set up in the past.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const errorRaceInThePast = (interaction: DiscordInteraction) => {
  interaction.reply(
    getErrorEmbed(
      "Error",
      "Ever heard about time continuity? A race can _not_ take place in the past, silly.",
    ),
  );
  return;
};

/**
 * Handles error caused by any of the timers provided being negative.
 * @param interaction DiscordInteraction
 * @param raceData RaceData
 * @returns void
 */
export const errorNegativeTimers = (
  interaction: DiscordInteraction,
  raceData: RaceData,
) => {
  interaction.reply(
    getErrorEmbed(
      "Wrong time provided",
      `There is something very wrong with the timers you provided.\n
      **Download grace period** - \`\`${
        raceData.downloadGrace
      }s\`\`\n**Upload grace period** - \`\`${raceData.uploadGrace}s\`\`
      ${
        raceData.playLimit ? `**Play time limit** - ${raceData.playLimit}m` : ""
      }\n
      At least one of those looks _seriously wrong_.`,
    ),
  );
  return;
};

/**
 * Handles error caused by download link not being an actual HTTP link.
 * @param interaction DiscordInteraction
 * @param raceData RaceData
 * @returns void
 */
export const errorWrongDownloadLink = (
  interaction: DiscordInteraction,
  raceData: RaceData,
) => {
  interaction.reply(
    getErrorEmbed(
      "Wrong download link",
      `${raceData.downloadLink} → Does _this_ look like a link to you?`,
    ),
  );
  return;
};
