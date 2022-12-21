import { SlashCommandBuilder } from "discord.js";

export enum Options {
  NAME = "name",
  DESCRIPTION = "description",
  ICON = "icon",
  IS_SPECIAL = "special",
}

/**
 * Builder for the custom "seasoncreate" command.
 */
export const seasoncreateBuilder = new SlashCommandBuilder()
  .setName("seasoncreate")
  .addStringOption(option =>
    option
      .setName(Options.NAME)
      .setDescription("Name of the new season.")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName(Options.DESCRIPTION)
      .setDescription("Description of the new season.")
      .setRequired(true),
  )
  .addAttachmentOption(option =>
    option
      .setName(Options.ICON)
      .setDescription("Icon of the new season.")
      .setRequired(true),
  )
  .addBooleanOption(option =>
    option
      .setName(Options.IS_SPECIAL)
      .setDescription(
        "Is this a 'special' season? (season other than a 'main' season)?",
      )
      .setRequired(true),
  );
