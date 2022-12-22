import { DiscordInteraction, getInfoEmbed } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";
import { APIEmbed, APIEmbedField } from "discord.js";
import dayjs from "dayjs";

import { sdk } from "fetus";
import { createError, ErrorAction, getDiscordTimestamp } from "utils";

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
      return;
    }
    const activeRace = await sdk.getRaceById({
      raceId: String(activeRaces[0]?._id),
    });
    // @ts-ignore
    const csv = activeRace.leaderboards.map();
    // interaction.editReply({ embeds: [getActiveRaceEmbed(activeRaces[0])] });
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
      value: getDiscordTimestamp(activeRace.startDate, !isOngoing),
      inline: true,
    },
    {
      name: "Finish time",
      value: getDiscordTimestamp(activeRace.startDate, isOngoing),
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
