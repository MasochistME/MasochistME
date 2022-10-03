import { SlashCommandBuilder } from "discord.js";

export const addmemeBuilder = new SlashCommandBuilder()
  .setName("addmeme")
  .addStringOption(option =>
    option
      .setName("meme")
      .setDescription("Text or link of the meme")
      .setRequired(true),
  );

export const deletememeBuilder = new SlashCommandBuilder()
  .setName("deletememe")
  .addStringOption(option =>
    option
      .setName("memeindex")
      .setDescription("Number of the meme to be deleted")
      .setRequired(true),
  );
