import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom deletebadge command
 */
export const badgedeleteBuilder = new SlashCommandBuilder()
  .setName("badgedelete")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge which will be removed")
      .setRequired(true)
      .setAutocomplete(true),
  );
