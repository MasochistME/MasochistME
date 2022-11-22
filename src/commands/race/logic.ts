import { DiscordInteraction, getInfoEmbed } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";
import { APIEmbed, APIEmbedField } from "discord.js";
import dayjs from "dayjs";

import { sdk } from "fetus";
import { createError, ErrorAction, getUTCDate } from "utils";

/**
 * Displays info about an ongoing or soon starting race, if it exists.
 * @param interaction DiscordInteraction
 * @return void
 */
export const race = async (interaction: DiscordInteraction): Promise<void> => {
  await interaction.deferReply();

  try {
    const activeRaces = await sdk.getActiveRace();
    if (!activeRaces.length) {
      interaction.editReply(
        getInfoEmbed(
          "No active races",
          "There is no ongoing races at this moment, not any are planned in the future.",
        ),
      );
    } else {
      interaction.editReply({ embeds: [getActiveRaceEmbed(activeRaces[0])] });
    }
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

/**
 * Creates an embed for the active race
 * @param activeRace Race
 * @return APIEmbed
 */
const getActiveRaceEmbed = (activeRace: Race): APIEmbed => {
  const isOngoing =
    dayjs(activeRace.startDate).diff(new Date()) < 0 &&
    dayjs(activeRace.endDate).diff(new Date()) > 0;

  const fields: APIEmbedField[] = [
    {
      name: "Name",
      value: activeRace.name,
    },
    {
      name: "Instructions",
      value: activeRace.instructions,
    },
    {
      name: "Start time",
      value: isOngoing
        ? getUTCDate(activeRace.startDate)
        : dayjs(activeRace.startDate).fromNow(),
      inline: true,
    },
    {
      name: "Finish time",
      value: isOngoing
        ? dayjs(activeRace.endDate).fromNow()
        : getUTCDate(activeRace.endDate),
      inline: true,
    },
    {
      name: "Download link",
      value: activeRace.downloadLink,
    },
    {
      name: "Screenshot upload grace period",
      value: `${activeRace.uploadGrace} s`,
      inline: true,
    },
  ];

  if (activeRace.type === RaceType.SCORE_BASED)
    // optional field
    fields.push({
      name: "Play time limit",
      value: `${(activeRace as RaceScoreBased).playLimit} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title: isOngoing
      ? `🏃 ${activeRace.name} - running NOW`
      : `⏳ ${activeRace.name.toUpperCase()} - starting soon`,
    fields: fields,
    ...(activeRace.icon && { thumbnail: { url: activeRace.icon } }),
  };

  return embed;
};
