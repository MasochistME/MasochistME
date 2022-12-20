import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  APIEmbed,
  APIEmbedField,
  Message,
} from "discord.js";
import dayjs from "dayjs";
import { getErrorEmbed, getInfoEmbed, getSuccessEmbed, log } from "arcybot";
import { Race, RaceType, RaceScoreBased } from "@masochistme/sdk/dist/v1/types";

import { bot, sdk } from "fetus";
import { RaceButton } from "consts";
import { ImgType, saveImage } from "utils/saveImage";
import {
  awaitMessage,
  getUTCDate,
  getModChannel,
  cenzor,
  createError,
  ErrorAction,
} from "utils";
import {
  informModsAboutRaceFinish,
  informModsAboutRaceForfeit,
} from "./informModsAboutParticipant";

const fieldsBeforeReveal = [
  {
    name: "---",
    value: `1. Once you click the **REVEAL** button, the grace time begins. It's a short time of undisclosured length for downloading and starting the game - it will get substracted from your final time.
  \n2. After the game is downloaded and you are ready to start, click the **START** button. **Remember to do this or your race will get forfeited!**
  \nGood luck! You can start the race whenever it's convenient for you within the time limit.`,
  },
];
const fieldsAfterReveal = [
  {
    name: "---",
    value: `**The grace period has started** - it will get substracted from your final score while you download the game.
  \nWhen you are ready to start click the **START** button. **Remember to do this or your race will get forfeited!**`,
  },
];

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
    log.INFO("Preparing to inform race participants about race starting...");
    getModChannel(true)?.send(
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
              fieldsBeforeReveal,
            ),
          ],
          components: [getRaceStartButtons(raceId, true, false, false, false)],
        })
        .then(() => {
          getModChannel(true)?.send(
            getSuccessEmbed(
              `${race.name.toUpperCase()} - PARTICIPANT UPDATED`,
              `Participant <@${userId}> got informed about race starting.`,
            ),
          );
          log.INFO(`Discord user ${userId} informed about the race starting!`);
        })
        .catch(() => {
          getModChannel(true)?.send(
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
    getModChannel(true)?.send(
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
    interaction.user.send({
      embeds: [
        getRaceStartEmbed(
          race,
          `⏳ ${race.name.toUpperCase()} - PREPARING...`,
          true,
          fieldsBeforeReveal,
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
    const revealDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { revealDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");

    interaction.update({
      embeds: [
        getRaceStartEmbed(
          race,
          `⌛ ${race.name.toUpperCase()} - READY TO GO`,
          false,
          fieldsAfterReveal,
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
        name: "---",
        value: `When you are done click the **FINISH** button - this will prompt you to upload a proof of finishing the race.
        \nYou'll have ${race.uploadGrace} seconds to upload your screenshot. If you exceed that time it's fine, but the additional time will be added to your final score.`,
      },
      {
        name: "Your start time",
        value: getUTCDate(startDate),
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
    const participant = await sdk.getRaceParticipantById({
      raceId,
      memberId: interaction.user.id,
    });
    const startDate = participant?.startDate;
    const endDate = new Date();
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId: interaction.user.id,
      update: { endDate },
    });
    if (!acknowledged) throw new Error("Database did not respond.");
    const tempFields = [
      {
        name: "Your start time",
        value: getUTCDate(startDate),
        inline: true,
      },
      {
        name: "Your finish time",
        value: getUTCDate(endDate),
        inline: true,
      },
    ];
    interaction
      .update({
        embeds: [
          getRaceStartEmbed(
            race,
            `☑️ ${race.name.toUpperCase()} - FINISHED`,
            false,
            tempFields,
          ),
        ],
        components: [getRaceStartButtons(raceId, false, false, false, false)],
        fetchReply: true,
      })
      .then(() => {
        raceUploadProof(interaction, race);
      });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};

const raceUploadProof = async (
  interaction: ButtonInteraction,
  race: Race,
): Promise<void> => {
  const channel = interaction?.channel;
  if (!channel) return;

  channel.send(
    getInfoEmbed(
      "Upload the proof",
      `Please post a proof of you finishing the race below this message within the next ${race.uploadGrace} seconds.
      \nIf you exceed that time it's fine, but every second above the grace period will be added to your final score.`,
    ),
  );
  try {
    const raceId = String(race._id);
    const memberId = interaction.user.id;
    const filter = (msg: Message) => !!msg.attachments.size;
    const time = dayjs(race.endDate).diff(new Date());
    const proofCollection = await awaitMessage<ButtonInteraction>(
      interaction,
      filter,
      time,
    );
    const proof = proofCollection?.attachments?.first()?.proxyURL;
    if (!proof)
      throw new Error(
        "I could not collect a proof. Reason unknown. Probably something fucked up.",
      );
    const fixedImage = await saveImage(
      proof,
      `race-${raceId}_player-${memberId}`,
      ImgType.RACE,
    );
    const { acknowledged } = await sdk.updateRaceByParticipantId({
      raceId,
      memberId,
      update: { proof: fixedImage, proofDate: new Date() },
    });
    if (!acknowledged)
      throw new Error(
        "Could not save your proof. Reason unknown but probably database died or something.",
      );
    channel.send(
      getSuccessEmbed("You successfully uploaded your proof!", fixedImage),
    );
    informModsAboutRaceFinish(raceId, memberId);
  } catch (err: any) {
    createError(interaction, err, ErrorAction.SEND);
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
      name: "Screenshot upload grace period",
      value: `${race.uploadGrace} s`,
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
        inline: true,
      },
      ...(newFields ?? []),
    ],
  };

  return embed;
};
