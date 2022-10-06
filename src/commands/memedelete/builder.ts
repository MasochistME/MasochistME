import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the memedelete command.
 */
export const memedeleteBuilder = new SlashCommandBuilder()
  .setName("memedelete")
  .addStringOption(option =>
    option
      .setName("memeindex")
      .setDescription("Number of the meme to be deleted")
      .setRequired(true),
  );
