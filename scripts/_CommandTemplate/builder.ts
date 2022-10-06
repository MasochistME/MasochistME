import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom "template" command.
 */
export const templateBuilder = new SlashCommandBuilder()
  .setName("template")
  .addStringOption(option =>
    option
      .setName("stringoption")
      .setDescription("Description of string option for your template command.")
      .setRequired(true)
      .setAutocomplete(true),
  );
