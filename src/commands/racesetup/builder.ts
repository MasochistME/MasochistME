import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export enum Options {
  NAME = "name",
  SEASON = "season",
  INSTRUCTIONS = "instructions",
  OBJECTIVES = "objectives",
  STARTS_IN = "starts-in",
  ENDS_AFTER = "ends-after",
  DOWNLOAD_LINK = "download-link",
  DOWNLOAD_GRACE = "download-grace",
  UPLOAD_GRACE = "upload-grace",
  PLAY_LIMIT = "play-time",
  ICON = "icon",
}

/**
 * Returns a bunch of common REQUIRED options shared between time-based and score-based races.
 * @param subcommand SlashCommandSubcommandBuilder
 * @return SlashCommandSubcommandBuilder
 */
const getCommonRequiredOptionsRaceSetup = (
  subcommand: SlashCommandSubcommandBuilder,
) => {
  return subcommand
    .addStringOption(option =>
      option
        .setName(Options.NAME)
        .setDescription("Name of the race")
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName(Options.DOWNLOAD_LINK)
        .setDescription(
          "Download link for the race game (MUST start with http)",
        )
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName(Options.INSTRUCTIONS)
        .setDescription("Instructions visible before starting the race")
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName(Options.OBJECTIVES)
        .setDescription(
          "Instructions visible after revealing the download link",
        )
        .setRequired(true),
    )
    .addNumberOption(option =>
      option
        .setName(Options.STARTS_IN)
        .setDescription("Race starts in? [hours]")
        .setRequired(true),
    )
    .addNumberOption(option =>
      option
        .setName(Options.ENDS_AFTER)
        .setDescription("Race ends after? [hours]")
        .setRequired(true),
    )
    .addNumberOption(option =>
      option
        .setName(Options.DOWNLOAD_GRACE)
        .setDescription("Grace period for the game download [seconds]")
        .setRequired(true),
    )
    .addNumberOption(option =>
      option
        .setName(Options.UPLOAD_GRACE)
        .setDescription("Grace period for the screenshot upload [seconds]")
        .setRequired(true),
    );
};

/**
 * Returns a bunch of common OPTIONAL options shared between time-based and score-based races.
 * @param subcommand SlashCommandSubcommandBuilder
 * @return SlashCommandSubcommandBuilder
 */
const getCommonOptionalOptionsRaceSetup = (
  subcommand: SlashCommandSubcommandBuilder,
) => {
  return subcommand
    .addStringOption(option =>
      option
        .setName(Options.SEASON)
        .setDescription(
          "(Optional) Active season the race should be included in",
        )
        .setAutocomplete(true),
    )
    .addAttachmentOption(option =>
      option
        .setName(Options.ICON)
        .setDescription("(Optional) Icon of the race"),
    );
};

/**
 * Builder for the custom "racesetup" command.
 */
export const racesetupBuilder = new SlashCommandBuilder()
  .setName("racesetup")
  .addSubcommand(subcommand => {
    const subcommandWithCommonRecommendedOptions =
      getCommonRequiredOptionsRaceSetup(subcommand);
    const subcommandWithTypeSpecificOptions =
      subcommandWithCommonRecommendedOptions
        .setName("time-based")
        .setDescription(
          "Set up a time based race (winner has the fastest completion time).",
        );
    return getCommonOptionalOptionsRaceSetup(subcommandWithTypeSpecificOptions);
  })
  .addSubcommand(subcommand => {
    const subcommandWithCommonRecommendedOptions =
      getCommonRequiredOptionsRaceSetup(subcommand);
    const subcommandWithTypeSpecificOptions =
      subcommandWithCommonRecommendedOptions
        .setName("score-based")
        .setDescription(
          "Set up a score based race (winner has the highest score within a time frame).",
        )
        .addNumberOption(option =>
          option
            .setName(Options.PLAY_LIMIT)
            .setDescription("Time limit for achieving the best score [minutes]")
            .setRequired(true),
        );
    return getCommonOptionalOptionsRaceSetup(subcommandWithTypeSpecificOptions);
  });
