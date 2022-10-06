import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom givebadge command
 */
export const badgegiveBuilder = new SlashCommandBuilder()
  .setName("badgegive")
  .addStringOption(option =>
    option
      .setName("badge")
      .setDescription("Badge to search for")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("member")
      .setDescription("Member to search for")
      .setAutocomplete(true)
      .setRequired(true),
  );
