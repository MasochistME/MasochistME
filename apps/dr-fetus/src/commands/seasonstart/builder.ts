import { SlashCommandBuilder } from "discord.js";

export enum Options {
  SEASON_ID = "season",
}

/**
 * Builder for the custom "seasonstart" command.
 */
export const seasonstartBuilder = new SlashCommandBuilder()
  .setName("seasonstart")
  .addStringOption(option =>
    option
      .setName(Options.SEASON_ID)
      .setDescription("Search for the inactive season you want to start.")
      .setAutocomplete(true)
      .setRequired(true),
  );
