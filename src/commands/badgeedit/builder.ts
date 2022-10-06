import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom editbadge command
 */
export const badgeeditBuilder = new SlashCommandBuilder()
  .setName("badgeedit")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge which will be updated")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption(option =>
    option.setName("name").setDescription("Name of the badge"),
  )
  .addStringOption(option =>
    option.setName("description").setDescription("Badge's description"),
  )
  .addNumberOption(option =>
    option.setName("points").setDescription("Badge's point value"),
  )
  .addStringOption(option =>
    option.setName("requirements").setDescription("Badge requirement"),
  )
  .addAttachmentOption(option =>
    option.setName("image").setDescription("Image for the badge"),
  );
