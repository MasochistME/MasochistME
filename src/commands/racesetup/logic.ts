import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { getErrorEmbed, DiscordInteraction, log } from "arcybot";

import { RACE_CONFIRMATION } from "consts";
import { isLink } from "utils";

import { Options } from "./builder";
import {
  errorEndsBeforeStart,
  errorRaceInThePast,
  errorNegativeTimers,
  errorWrongDownloadLink,
} from "./errors";

export type RaceData = {
  name: string;
  instructions: string;
  startsIn: number;
  endsAfter: number;
  downloadLink: string;
  downloadGrace: number;
  uploadGrace: number;
  playLimit: number | null;
  icon?: string;
};
/**
 * Describe your "racesetup" command here.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const racesetup = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const raceData: RaceData = {
    name: interaction.options.getString(Options.NAME, true),
    instructions: interaction.options.getString(Options.INSTRUCTIONS, true),
    startsIn: interaction.options.getNumber(Options.STARTS_IN, true),
    endsAfter: interaction.options.getNumber(Options.ENDS_AFTER, true),
    downloadLink: interaction.options.getString(Options.DOWNLOAD_LINK, true),
    downloadGrace: interaction.options.getNumber(Options.DOWNLOAD_GRACE, true),
    uploadGrace: interaction.options.getNumber(Options.UPLOAD_GRACE, true),
    playLimit: interaction.options.getNumber(Options.PLAY_LIMIT),
    icon: interaction.options.getAttachment(Options.ICON)?.url,
  };

  if (raceData.startsIn + raceData.endsAfter <= 0)
    return errorEndsBeforeStart(interaction);
  if (raceData.startsIn < 0 || raceData.endsAfter < 0)
    return errorRaceInThePast(interaction);
  if (!isLink(raceData.downloadLink))
    return errorWrongDownloadLink(interaction, raceData);
  if (
    raceData.downloadGrace < 0 ||
    raceData.uploadGrace < 0 ||
    Number(raceData.playLimit) < 0
  )
    return errorNegativeTimers(interaction, raceData);

  try {
    interaction.reply({
      embeds: [getRaceConfirmationEmbed(raceData)],
      components: [getRaceConfirmationButtons()],
    });
  } catch (err: any) {
    interaction.editReply(getErrorEmbed("Error", "Your command did not work!"));
    log.WARN(err);
  }
};

/**
 * Creates a row of buttons - confirm and reject - for the confirmation of new race
 * @returns ActionRowBuilder<ButtonBuilder>
 */
const getRaceConfirmationButtons = () => {
  const buttonConfirm = new ButtonBuilder()
    .setCustomId(`${RACE_CONFIRMATION}_CONFIRM`)
    .setLabel("Confirm")
    .setStyle(ButtonStyle.Success);
  const buttonReject = new ButtonBuilder()
    .setCustomId(`${RACE_CONFIRMATION}_REJECT`)
    .setLabel("Reject")
    .setStyle(ButtonStyle.Danger);
  const buttonBar = new ActionRowBuilder<ButtonBuilder>().addComponents(
    buttonConfirm,
    buttonReject,
  );

  return buttonBar;
};

/**
 * Creates an embed for the race review before starting
 * @param interaction DiscordInteraction
 * @returns APIEmbed
 */
const getRaceConfirmationEmbed = (raceData: RaceData) => {
  const getDate = (delay: number) => {
    const time = Date.now();
    const delayInMs = delay * 60 * 60 * 1000;
    const date = new Date(time + delayInMs).toLocaleString();
    return date;
  };

  const fields: APIEmbedField[] = [
    {
      name: "Name",
      value: raceData.name,
    },
    {
      name: "Instructions",
      value: raceData.instructions,
    },
    {
      name: "Start time",
      value: getDate(raceData.startsIn),
      inline: true,
    },
    {
      name: "Finish time",
      value: getDate(raceData.startsIn + raceData.endsAfter),
      inline: true,
    },
    {
      name: "Download link",
      value: raceData.downloadLink,
    },
    {
      name: "Download grace period",
      value: `${raceData.downloadGrace} seconds`,
      inline: true,
    },
    {
      name: "Screenshot upload grace period",
      value: `${raceData.uploadGrace} seconds`,
      inline: true,
    },
  ];

  if (raceData.playLimit)
    // optional field
    fields.push({
      name: "Play time limit",
      value: `${raceData.playLimit} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title: `⏳ New race - **${raceData.name}** - awaiting confirmation...`,
    fields: fields,
    ...(raceData.icon && { thumbnail: { url: raceData.icon } }),
  };

  return embed;
};
