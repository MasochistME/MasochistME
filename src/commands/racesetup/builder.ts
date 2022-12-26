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
  ICON = "icon",
  OWNER = "owner",
  OWNERS_TIME = "owners-time",
  // Score race specific
  OWNERS_SCORE = "owners-score",
  PLAY_LIMIT = "play-time",
  WARNING_PERIOD = "warning-period",
}

export enum OptionRaceType {
  TIME_BASED = "time-based",
  SCORE_BASED = "score-based",
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
        .setName(Options.SEASON)
        .setDescription("Active season the race should be included in")
        .setRequired(true)
        .setAutocomplete(true),
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
    .addAttachmentOption(option =>
      option
        .setName(Options.ICON)
        .setDescription("(Optional) Icon of the race"),
    )
    .addUserOption(option =>
      option
        .setName(Options.OWNER)
        .setDescription(
          "Owner of the race (leave empty to set you as an owner)",
        ),
    );
};

/**
 * Builder for the custom "racesetup" command.
 */
export const racesetupBuilder = new SlashCommandBuilder()
  .setName("racesetup")
  .addSubcommand(subcommand => {
    const subcommandWithTypeSpecificOptions = getCommonRequiredOptionsRaceSetup(
      subcommand,
    )
      .setName(OptionRaceType.TIME_BASED)
      .setDescription(
        "Set up a time based race (winner has the fastest completion time).",
      )
      .addNumberOption(option =>
        option
          .setName(Options.OWNERS_TIME)
          .setDescription(
            "Owner's time in seconds (leave empty if owner does not want to participate)",
          ),
      );
    return getCommonOptionalOptionsRaceSetup(subcommandWithTypeSpecificOptions);
  })
  .addSubcommand(subcommand => {
    const subcommandWithTypeSpecificOptions = getCommonRequiredOptionsRaceSetup(
      subcommand,
    )
      .setName(OptionRaceType.SCORE_BASED)
      .setDescription(
        "Set up a score based race (winner has the highest score within a time frame).",
      )
      .addNumberOption(option =>
        option
          .setName(Options.PLAY_LIMIT)
          .setDescription("Time limit for achieving the best score [minutes]")
          .setRequired(true),
      )
      .addNumberOption(option =>
        option
          .setName(Options.WARNING_PERIOD)
          .setDescription("Time to warn player before end of the run [minutes]")
          .setRequired(true),
      )
      .addNumberOption(option =>
        option
          .setName(Options.OWNERS_SCORE)
          .setDescription(
            "Owner's score (leave empty if owner does not want to participate)",
          ),
      );
    return getCommonOptionalOptionsRaceSetup(subcommandWithTypeSpecificOptions);
  });
