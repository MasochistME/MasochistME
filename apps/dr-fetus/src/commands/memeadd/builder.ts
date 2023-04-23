import { SlashCommandBuilder } from "discord.js";

/**
 * Builder for the memeadd command.
 */
export const memeaddBuilder = new SlashCommandBuilder()
  .setName("memeadd")
  .addStringOption(option =>
    option
      .setName("meme")
      .setDescription("Text or link of the meme")
      .setRequired(true),
  );
