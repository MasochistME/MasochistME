import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { getErrorEmbed, getInfoEmbed, getSuccessEmbed, log } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";

import { bot, sdk } from "fetus";
import { RaceButton } from "consts";
import {
  getUTCDate,
  getModChannel,
  cenzor,
  createError,
  ErrorAction,
} from "utils";

/**
 * Message sent to race participant on DM when the race begins.
 * @param raceId string
 * @return void
 */
export const raceReadyToGo = async (raceId: string): Promise<void> => {
  try {
    const race = await sdk.getRaceById({ raceId });
    const participants = await sdk.getRaceParticipantsList({ raceId });
    const participantsDiscordIds = participants.map(
      participant => participant.discordId,
    );
    const tempFields = [
      {
        name: "---",
        value: `Your race begins once you click the **REVEAL** button. You have ${race.downloadGrace} seconds to download and set up the game.
      \n***Remember*** to click the **START** button when you are ready or your race will get forfeited!
      \nGood luck! You can start the race whenever it's convenient for you within the time limit.`,
      },
    ];
    log.INFO("Preparing to inform race participants about race starting...");
    getModChannel()?.send(
      getInfoEmbed(
        `${race.name.toUpperCase()} - RACE STARTED`,
        `Race successfully started!
        \nI'm sending DMs to all participants now...`,
      ),
    );
    participantsDiscordIds.forEach((userId: string) => {
      bot.botClient.users
        .send(userId, {
          embeds: [
            getRaceStartEmbed(
              race,
              `⏳ ${race.name.toUpperCase()} - PREPARING...`,
              true,
              tempFields,
            ),
          ],
          components: [getRaceStartButtons(raceId, true, false, false, false)],
        })
        .then(() => {
          getModChannel()?.send(
            getSuccessEmbed(
              `${race.name.toUpperCase()} - PARTICIPANT UPDATED`,
              `Participant <@${userId}> got informed about race starting.`,
            ),
          );
          log.INFO(`Discord user ${userId} informed about the race starting!`);
        })
        .catch(() => {
          getModChannel()?.send(
            getErrorEmbed(
              `${race.name.toUpperCase()} - PARTICIPANT NOT UPDATED`,
              `Participant <@${userId}> could not get informed about race starting.`,
            ),
          );
          log.WARN(
            `Discord user ${userId} could not be reached about the race starting!`,
          );
        });
    });
  } catch (err: any) {
    getModChannel()?.send(
      getErrorEmbed(
        `ERROR - RACE STARTING...`,
        err?.error ?? err?.message ?? err ?? "Something went wrong.",
      ),
    );
    // createError(interaction, err, ErrorAction.REPLY);
    log.WARN(err);
  }
};

/**
 * Handles situation where member joins the race after it already started.
 * @param interaction ButtonInteraction
 * @return void
 */
export const raceJoinAfterStart = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(`${RaceButton.RACE_JOIN}-`, "");
    const race = await sdk.getRaceById({ raceId });
    const tempFields = [
      {
        name: "---",
        value: `Your race begins once you click the **REVEAL** button. You have ${race.downloadGrace} seconds to download and set up the game.
      \n***Remember*** to click the **START** button when you are ready or your race will get forfeited!
      \nGood luck! You can start the race whenever it's convenient for you within the time limit.`,
      },
    ];
    interaction.user.send({
      embeds: [
        getRaceStartEmbed(
          race,
          `⏳ ${race.name.toUpperCase()} - PREPARING...`,
          true,
          tempFields,
        ),
      ],
      components: [getRaceStartButtons(raceId, true, false, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Response to race participant clicking the REVEAL button.
 * @param interaction ButtonInteraction
 * @return void
 */
export const raceReveal = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_REVEAL}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });

    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `⌛ ${race.name.toUpperCase()} - READY TO GO`,
          false,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, true, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Response to race participant clicking the START button.
 * @param interaction ButtonInteraction
 * @return void
 */
export const raceStart = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_START}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });
    const startDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { startDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const tempFields = [
      {
        name: "Your start time",
        value: startDate.toLocaleTimeString(),
        inline: true,
      },
    ];
    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `🎮 ${race.name.toUpperCase()} - IN PROGRESS`,
          false,
          tempFields,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, false, true, true)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Response to race participant clicking the FINISH button.
 * @param interaction
 * @return void
 */
export const raceFinish = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_FINISH}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });
    const endDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { endDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const originalEmbed = interaction.message.embeds[0].data;
    const editedEmbed = {
      ...originalEmbed,
      fields: [
        ...(originalEmbed.fields ?? []),
        {
          name: "Your finish time",
          value: endDate.toLocaleTimeString(),
          inline: true,
        },
      ],
    };
    interaction.update({
      embeds: [
        {
          ...editedEmbed,
          title: `☑️ ${race.name.toUpperCase()} - FINISHED`,
        },
      ],
      components: [getRaceStartButtons(raceId, false, false, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Response to race participant clicking the GIVE UP button.
 * @param interaction
 * @return void
 */
export const raceGiveUp = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;

  try {
    const raceId = interaction.customId.replace(
      `${RaceButton.RACE_GIVE_UP}-`,
      "",
    );
    const race = await sdk.getRaceById({ raceId });

    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { dnf: true },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const tempFields = [
      {
        name: "---",
        value: `You gave up :( You won't be able to rejoin this race.`,
      },
    ];
    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `❌ ${race.name.toUpperCase()} - WALKOVER`,
          false,
          tempFields,
        ),
      ],
      components: [getRaceStartButtons(raceId, false, false, false, false)],
    });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

/**
 * Creates a row of buttons for the user to manage their race.
 * @param raceId string
 * @param canFinish boolean
 * @return ActionRowBuilder<ButtonBuilder>
 */
const getRaceStartButtons = (
  raceId: string,
  isRevealButtonEnabled: boolean,
  isStartButtonEnabled: boolean,
  isFinishButtonEnabled: boolean,
  isGiveUpButtonEnabled: boolean,
) => {
  const buttonRevealRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_REVEAL}-${raceId}`)
    .setLabel("REVEAL")
    .setStyle(
      isRevealButtonEnabled ? ButtonStyle.Primary : ButtonStyle.Secondary,
    )
    .setDisabled(!isRevealButtonEnabled);
  const buttonStartRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_START}-${raceId}`)
    .setLabel("START")
    .setStyle(
      isStartButtonEnabled ? ButtonStyle.Success : ButtonStyle.Secondary,
    )
    .setDisabled(!isStartButtonEnabled);
  const buttonFinishRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_FINISH}-${raceId}`)
    .setLabel("FINISH")
    .setStyle(
      isFinishButtonEnabled ? ButtonStyle.Primary : ButtonStyle.Secondary,
    )
    .setDisabled(!isFinishButtonEnabled);
  const buttonGiveUpRace = new ButtonBuilder()
    .setCustomId(`${RaceButton.RACE_GIVE_UP}-${raceId}`)
    .setLabel("GIVE UP")
    .setStyle(ButtonStyle.Danger)
    .setDisabled(!isGiveUpButtonEnabled);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonRevealRace,
    buttonStartRace,
    buttonFinishRace,
    buttonGiveUpRace,
  );
  return buttonBar;
};

/**
 * Creates an embed for user to start and finish the race
 * @param race Race
 * @param isCenzored boolean
 * @return APIEmbed
 */
const getRaceStartEmbed = (
  race: Race,
  title: string,
  isCenzored: boolean,
  newFields?: APIEmbedField[],
): APIEmbed => {
  const fields: APIEmbedField[] = [
    {
      name: "Instructions",
      value: race.instructions,
    },
    {
      name: "Objectives",
      value: isCenzored ? cenzor(race.objectives) : race.objectives,
    },
    {
      name: "Start time",
      value: getUTCDate(race.startDate),
      inline: true,
    },
    {
      name: "Finish time",
      value: getUTCDate(race.endDate),
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
    ...(!isCenzored && race.icon && { thumbnail: { url: race.icon } }),
    fields: [
      ...fields,
      {
        name: "Race organizer",
        value: `<@${race.organizer}>`,
      },
      ...(newFields ?? []),
    ],
  };

  return embed;
};
