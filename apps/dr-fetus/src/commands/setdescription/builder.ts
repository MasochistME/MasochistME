import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the custom "setdescription" command.
 */
export const setdescriptionBuilder = new SlashCommandBuilder()
  .setName("setdescription")
  .addStringOption(option =>
    option
      .setName("description")
      .setDescription("Description to appear on your Masochist.ME profile.")
      .setMaxLength(700)
      .setRequired(true),
  );
