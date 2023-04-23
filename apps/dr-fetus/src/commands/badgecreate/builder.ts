import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom createbadge command
 */
export const badgecreateBuilder = new SlashCommandBuilder()
  .setName("badgecreate")
  .addStringOption(option =>
    option
      .setName("game")
      .setDescription("Game which gets the badge")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption(option =>
    option
      .setName("name")
      .setDescription("Name of the badge")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("description")
      .setDescription("Description of the badge")
      .setRequired(true),
  )
  .addNumberOption(option =>
    option
      .setName("points")
      .setDescription("Points that the badge is worth")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("requirements")
      .setDescription("Requirements for the badge")
      .setRequired(true),
  )
  .addAttachmentOption(option =>
    option
      .setName("image")
      .setDescription("Image for the badge")
      .setRequired(true),
  );
