import { SlashCommandBuilder } from "discord.js";

export const registerBuilder = new SlashCommandBuilder()
  .setName("register")
  .addStringOption(option =>
    option
      .setName("link")
      .setDescription("Link to your Masochist.ME profile")
      .setRequired(true),
  );
