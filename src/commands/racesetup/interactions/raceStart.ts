import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { getErrorEmbed } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";

import { sdk } from "fetus";
import { RACE_JOIN, RACE_START, RACE_FINISH } from "consts";
import { getUTCDate, cenzor } from "utils";

export const raceReadyToGo = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  const raceId = interaction.customId.replace(`${RACE_JOIN}-`, "");
  const race = await sdk.getRaceById({ id: raceId });

  interaction.user.send({
    embeds: [
      getRaceStartEmbed(
        race,
        `⏳ ${race.name.toUpperCase()} - READY TO GO`,
        true,
      ),
    ],
    components: [getRaceStartButtons(raceId, true, false)],
  });
};

/**
 *
 * @param interaction
 * @returns void
 */
export const raceStart = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  const raceId = interaction.customId.replace(`${RACE_START}-`, "");
  const race = await sdk.getRaceById({ id: raceId });

  try {
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      discordId: interaction.user.id,
      update: { startTime: new Date() },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `⌛ ${race.name.toUpperCase()} - IN PROGRESS`,
          false,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, true)],
    });
  } catch (err: any) {
    interaction.reply(
      getErrorEmbed("Error", err ?? "Something went wrong. Try again later"),
    );
  }
};

/**
 *
 * @param interaction
 * @returns void
 */
export const raceFinish = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  const raceId = interaction.customId.replace(`${RACE_FINISH}-`, "");
  const race = await sdk.getRaceById({ id: raceId });

  try {
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      discordId: interaction.user.id,
      update: { endTime: new Date() },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `☑️ ${race.name.toUpperCase()} - FINISHED`,
          false,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, false)],
    });
  } catch (err: any) {
    interaction.reply(
      getErrorEmbed("Error", err ?? "Something went wrong. Try again later"),
    );
  }
};

/**
 * Creates a row of buttons for the user to start and finish the race.
 * @param raceId string
 * @param canFinish boolean
 * @returns ActionRowBuilder<ButtonBuilder>
 */
const getRaceStartButtons = (
  raceId: string,
  isStartButtonEnabled: boolean,
  isFinishButtonEnabled: boolean,
) => {
  const buttonStartRace = new ButtonBuilder()
    .setCustomId(`${RACE_START}-${raceId}`)
    .setLabel("START")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!isStartButtonEnabled);
  const buttonFinishRace = new ButtonBuilder()
    .setCustomId(`${RACE_FINISH}-${raceId}`)
    .setLabel("FINISH")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!isFinishButtonEnabled);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonStartRace,
    buttonFinishRace,
  );
  return buttonBar;
};

/**
 * Creates an embed for user to start and finish the race
 * @param race Race
 * @param isCenzored boolean
 * @returns APIEmbed
 */
const getRaceStartEmbed = (
  race: Race,
  title: string,
  isCenzored: boolean,
): APIEmbed => {
  const fields: APIEmbedField[] = [
    {
      name: "Name",
      value: race.name,
    },
    {
      name: "Instructions",
      value: isCenzored ? cenzor(race.instructions) : race.instructions,
    },
    {
      name: "Start time",
      value: getUTCDate(race.startTime),
      inline: true,
    },
    {
      name: "Finish time",
      value: getUTCDate(race.endTime),
      inline: true,
    },
    {
      name: "Download link",
      value: isCenzored ? cenzor(race.downloadLink) : race.downloadLink,
    },
    {
      name: "Download grace period",
      value: `${race.downloadGrace} seconds`,
      inline: true,
    },
    {
      name: "Screenshot upload grace period",
      value: `${race.uploadGrace} seconds`,
      inline: true,
    },
  ];

  if (race.type === RaceType.SCORE_BASED)
    fields.push({
      name: "Play time limit",
      value: `${(race as RaceScoreBased).playLimit} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title,
    fields: [
      ...fields,
      {
        name: "Race organizer",
        value: `<@${race.organizer}>`,
      },
      {
        name: "---",
        value: `Good luck! You can start the race whenever it's convenient for you within the time limit.`,
      },
    ],
  };

  return embed;
};
