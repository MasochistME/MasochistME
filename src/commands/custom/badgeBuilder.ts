import { SlashCommandBuilder } from "discord.js";

export const givebadgeBuilder = new SlashCommandBuilder()
  .setName("givebadge")
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

export const revokebadgeBuilder = new SlashCommandBuilder()
  .setName("revokebadge")
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
