import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  APIEmbed,
  APIEmbedField,
} from "discord.js";
import { DiscordInteraction, getInfoEmbed } from "arcybot";
import {
  Race,
  RaceScoreBased,
  RaceTimeBased,
  RaceType,
} from "@masochistme/sdk/dist/v1/types";
import dayjs from "dayjs";

import { cache, sdk } from "fetus";
import { RACE_CONFIRMATION } from "consts";
import { isLink, getDiscordTimestamp, createError, ErrorAction } from "utils";
import { getRace, setDraftRace } from "commands/_utils/race";

import { OptionRaceType, Options } from "./builder";
import {
  errorEndsBeforeStart,
  errorRaceInThePast,
  errorNegativeTimers,
  errorWrongDownloadLink,
} from "./errors";

export type RaceData<T> = Omit<
  T,
  "startDate" | "endDate" | "isActive" | "isDone" | "_id"
> & {
  startsIn: number;
  endsAfter: number;
};

/**
 * Describe your "racesetup" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const racesetup = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const icon = interaction.options.getAttachment(Options.ICON);
  const startsIn = interaction.options.getNumber(Options.STARTS_IN, true);
  const endsAfter = interaction.options.getNumber(Options.ENDS_AFTER, true);
  const downloadLink = interaction.options.getString(
    Options.DOWNLOAD_LINK,
    true,
  );

  // Handle all the common errors between time and score based races
  if (icon && !icon.contentType?.includes("image/")) {
    throw "This type of file is not supported as a race icon. You need to upload an image.";
  }
  if (startsIn + endsAfter <= 0) {
    return errorEndsBeforeStart(interaction);
  }
  if (startsIn < 0 || endsAfter < 0) {
    return errorRaceInThePast(interaction);
  }
  if (!isLink(downloadLink)) {
    return errorWrongDownloadLink(interaction, downloadLink);
  }

  // Redirect to the relevant type of race
  const raceType = interaction.options.getSubcommand(true);

  if (raceType === OptionRaceType.TIME_BASED)
    return racesetupTimeBased(interaction);
  if (raceType === OptionRaceType.SCORE_BASED)
    return racesetupScoreBased(interaction);
  throw "Selected race type is not supported, please try again.";
};

/**
 * Time based race.
 * @param interaction DiscordInteraction
 * @returns void
 */
const racesetupTimeBased = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const rawSeason = interaction.options.getString(Options.SEASON, true);
  const cachedSeason = cache.seasons.find(
    s => s.name === rawSeason || String(s._id) === rawSeason,
  );
  const season = cachedSeason ? String(cachedSeason?._id) : null;

  const raceData: RaceData<RaceTimeBased> = {
    name: interaction.options.getString(Options.NAME, true),
    type: RaceType.TIME_BASED,
    downloadLink: interaction.options.getString(Options.DOWNLOAD_LINK, true),
    season,
    instructions: interaction.options.getString(Options.INSTRUCTIONS, true),
    objectives: interaction.options.getString(Options.OBJECTIVES, true),
    startsIn: interaction.options.getNumber(Options.STARTS_IN, true),
    endsAfter: interaction.options.getNumber(Options.ENDS_AFTER, true),
    downloadGrace: interaction.options.getNumber(Options.DOWNLOAD_GRACE, true),
    uploadGrace: interaction.options.getNumber(Options.UPLOAD_GRACE, true),
    ownerTime: interaction.options.getNumber(Options.OWNERS_TIME, false) ?? 0,
    // Score race specific fields
    icon: interaction.options.getAttachment(Options.ICON)?.proxyURL,
    owner:
      interaction.options.getUser(Options.OWNER, false)?.id ??
      interaction.user.id,
  };

  if (raceData.downloadGrace < 0 || raceData.uploadGrace < 0) {
    return errorNegativeTimers(
      interaction,
      raceData.downloadGrace,
      raceData.uploadGrace,
    );
  }

  const race = getRace(raceData);

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
 * Score based race.
 * @param interaction DiscordInteraction
 * @returns void
 */
const racesetupScoreBased = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const rawSeason = interaction.options.getString(Options.SEASON, true);
  const cachedSeason = cache.seasons.find(
    s => s.name === rawSeason || String(s._id) === rawSeason,
  );
  const season = cachedSeason ? String(cachedSeason?._id) : null;
  const raceData: RaceData<RaceScoreBased> = {
    name: interaction.options.getString(Options.NAME, true),
    type: RaceType.SCORE_BASED,
    downloadLink: interaction.options.getString(Options.DOWNLOAD_LINK, true),
    season,
    instructions: interaction.options.getString(Options.INSTRUCTIONS, true),
    objectives: interaction.options.getString(Options.OBJECTIVES, true),
    startsIn: interaction.options.getNumber(Options.STARTS_IN, true),
    endsAfter: interaction.options.getNumber(Options.ENDS_AFTER, true),
    downloadGrace: interaction.options.getNumber(Options.DOWNLOAD_GRACE, true),
    uploadGrace: interaction.options.getNumber(Options.UPLOAD_GRACE, true),
    // Score race specific fields
    playLimit: interaction.options.getNumber(Options.PLAY_LIMIT, true) * 60,
    warningPeriod:
      interaction.options.getNumber(Options.WARNING_PERIOD, true) * 60,
    ownerScore: interaction.options.getNumber(Options.OWNERS_SCORE, false) ?? 0,
    // Optional fields
    icon: interaction.options.getAttachment(Options.ICON)?.proxyURL,
    owner:
      interaction.options.getUser(Options.OWNER, false)?.id ??
      interaction.user.id,
  };

  if (
    raceData.downloadGrace < 0 ||
    raceData.uploadGrace < 0 ||
    Number(raceData.playLimit) < 0
  ) {
    return errorNegativeTimers(
      interaction,
      raceData.downloadGrace,
      raceData.uploadGrace,
      raceData.playLimit,
    );
  }

  const race = getRace(raceData);

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
  race: Omit<Race, "_id" | "isActive" | "isDone">,
) => {
  const season = race.season
    ? await sdk.getSeasonById({ seasonId: race.season })
    : null;
  const seasonName = season?.name ?? "None";

  const fields: APIEmbedField[] = [
    {
      name: "Name",
      value: race.name,
      inline: true,
    },
    { name: "Race type", value: race.type, inline: true },
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
      value: getDiscordTimestamp(race.startDate),
      inline: true,
    },
    {
      name: "Finish time",
      value: getDiscordTimestamp(race.endDate),
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
    ...(race.type === RaceType.SCORE_BASED
      ? [
          {
            name: "Play time limit",
            value: `${(race as RaceScoreBased).playLimit / 60} minutes`,
            inline: true,
          },
        ]
      : []),
    {
      name: "Season",
      value: seasonName,
      inline: true,
    },
    {
      name: "Owner",
      value: `<@${race.owner}>`,
      inline: true,
    },
    ...(race.type === RaceType.TIME_BASED
      ? [
          {
            name: "Owner's time",
            value: dayjs
              .duration(((race as RaceTimeBased)?.ownerTime ?? 0) * 1000)
              .format("H:mm:ss.SSS"),
            inline: true,
          },
        ]
      : [
          {
            name: "Owner's score",
            value: String((race as RaceScoreBased).ownerScore),
            inline: true,
          },
        ]),
  ];

  const embed: APIEmbed = {
    title: `⏳ New race - **${race.name}** - awaiting confirmation...`,
    fields,
    ...(race.icon && { thumbnail: { url: race.icon } }),
  };

  return embed;
};
