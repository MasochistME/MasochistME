import { SlashCommandBuilder } from "discord.js";

export const vidBuilder = new SlashCommandBuilder()
  .setName("vid")
  .addStringOption(option =>
    option
      .setName("link")
      .setDescription("Link to the video")
      .setRequired(true),
  );
