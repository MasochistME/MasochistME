import { SlashCommandBuilder } from "discord.js";

export const memeAddBuilder = new SlashCommandBuilder()
  .setName("memeadd")
  .addStringOption(option =>
    option
      .setName("meme")
      .setDescription("Text or link of the meme")
      .setRequired(true),
  );

export const memeDeleteBuilder = new SlashCommandBuilder()
  .setName("memedelete")
  .addStringOption(option =>
    option
      .setName("memeindex")
      .setDescription("Number of the meme to be deleted")
      .setRequired(true),
  );
