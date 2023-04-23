import { SlashCommandBuilder } from "discord.js";

export enum Options {
  STRING_OPTION = "stringoption",
  NUMBER_OPTION = "numberoption",
}

/**
 * Builder for the custom "template" command.
 */
export const templateBuilder = new SlashCommandBuilder()
  .setName("template")
  .addStringOption(option =>
    option
      .setName(Options.STRING_OPTION)
      .setDescription("Description of string option for your template command.")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addNumberOption(option =>
    option
      .setName(Options.NUMBER_OPTION)
      .setDescription(
        "Description of number option for your template command.",
      ),
  );
