import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom revokebadge command
 */
export const badgerevokeBuilder = new SlashCommandBuilder()
  .setName("badgerevoke")
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
