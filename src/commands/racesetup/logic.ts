import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { DiscordInteraction, getInfoEmbed } from "arcybot";
import { Race, RaceScoreBased, RaceType } from "@masochistme/sdk/dist/v1/types";

import { sdk } from "fetus";
import { RACE_CONFIRMATION } from "consts";
import { isLink, getUTCDate, createError, ErrorAction } from "utils";
import { getRace, setDraftRace } from "commands/_utils/race";

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
  objectives: string;
  startsIn: number;
  endsAfter: number;
  downloadLink: string;
  downloadGrace: number;
  uploadGrace: number;
  season: string | null;
  playLimit: number | null;
  icon?: string;
};
/**
 * Describe your "racesetup" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const racesetup = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const season = interaction.options.getString(Options.SEASON, true);
  const raceData: RaceData = {
    name: interaction.options.getString(Options.NAME, true),
    instructions: interaction.options.getString(Options.INSTRUCTIONS, true),
    objectives: interaction.options.getString(Options.OBJECTIVES, true),
    startsIn: interaction.options.getNumber(Options.STARTS_IN, true),
    endsAfter: interaction.options.getNumber(Options.ENDS_AFTER, true),
    downloadLink: interaction.options.getString(Options.DOWNLOAD_LINK, true),
    downloadGrace: interaction.options.getNumber(Options.DOWNLOAD_GRACE, true),
    uploadGrace: interaction.options.getNumber(Options.UPLOAD_GRACE, true),
    playLimit: interaction.options.getNumber(Options.PLAY_LIMIT),
    icon: interaction.options.getAttachment(Options.ICON)?.url,
    season: season === "None" ? null : season,
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

  const race = getRace(interaction, raceData);

  try {
    setDraftRace(race);
    interaction.reply(
      getInfoEmbed(
        "Race draft saved!",
        "I've sent you a confirmation message, check your DMs.",
      ),
    );
    interaction.user.send({
      embeds: [await getRaceConfirmationEmbed(race)],
      components: [getRaceConfirmationButtons()],
    });
  } catch (err: any) {
    console.log(err);
    createError(interaction, err, ErrorAction.SEND);
  }
};

/**
 * Creates a row of buttons - confirm and reject - for the confirmation of new race
 * @return ActionRowBuilder<ButtonBuilder>
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
 * @return APIEmbed
 */
const getRaceConfirmationEmbed = async (
  race: Omit<Race, "_id" | "isActive">,
) => {
  const season = race.season
    ? await sdk.getSeasonById({ seasonId: race.season })
    : null;
  const seasonName = season?.name ?? "None";
  const fields: APIEmbedField[] = [
    {
      name: "Name",
      value: race.name,
    },
    {
      name: "Instructions",
      value: race.instructions,
    },
    {
      name: "Objectives",
      value: race.objectives,
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
      value: race.downloadLink,
    },
    {
      name: "Download grace period",
      value: `${race.downloadGrace} s`,
      inline: true,
    },
    {
      name: "Screenshot upload grace period",
      value: `${race.uploadGrace} s`,
      inline: true,
    },
  ];

  if (race.type === RaceType.SCORE_BASED)
    // optional field
    fields.push({
      name: "Play time limit",
      value: `${(race as RaceScoreBased).playLimit} minutes`,
      inline: true,
    });

  const embed: APIEmbed = {
    title: `⏳ New race - **${race.name}** - awaiting confirmation...`,
    fields: [
      ...fields,
      {
        name: "Season",
        value: seasonName,
        inline: false,
      },
    ],
    ...(race.icon && { thumbnail: { url: race.icon } }),
  };

  return embed;
};
