import { SlashCommandBuilder } from "discord.js";

export enum Options {
  RACE = "race",
}

/**
 * Builder for the custom "race" command.
 */
export const raceBuilder = new SlashCommandBuilder()
  .setName("race")
  .addStringOption(option =>
    option
      .setName(Options.RACE)
      .setDescription("Select a race to preview.")
      .setRequired(true)
      .setAutocomplete(true),
  );
