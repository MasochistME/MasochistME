import { SlashCommandBuilder } from "discord.js";

export const vidBuilder = new SlashCommandBuilder()
  .setName("vid")
  .addStringOption(option =>
    option
      .setName("link")
      .setDescription("Link to the YouTube video")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName("game")
      .setDescription("Game featured in the video")
      .setAutocomplete(true)
      .setRequired(false),
  )
  .addStringOption(option =>
    option
      .setName("description")
      .setDescription("Short description of the video")
      .setRequired(false),
  );
