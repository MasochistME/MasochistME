import { SlashCommandBuilder } from "discord.js";

export enum Options {
  SEASON_ID = "season",
}

/**
 * Builder for the custom "seasonend" command.
 */
export const seasonendBuilder = new SlashCommandBuilder()
  .setName("seasonend")
  .addStringOption(option =>
    option
      .setName(Options.SEASON_ID)
      .setDescription("Search for the active season you want to finish.")
      .setAutocomplete(true)
      .setRequired(true),
  );
