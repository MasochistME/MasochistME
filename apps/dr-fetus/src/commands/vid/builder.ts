import { SlashCommandBuilder } from "discord.js";

export enum Options {
  VIDEO_LINK = "video-link",
  GAME_LINK = "game-link",
  GAME = "game",
  DESCRIPTION = "description",
}

export const vidBuilder = new SlashCommandBuilder()
  .setName("vid")
  .addStringOption(option =>
    option
      .setName(Options.VIDEO_LINK)
      .setDescription("Link to the YouTube video")
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName(Options.GAME)
      .setDescription("Game featured in the video")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName(Options.DESCRIPTION)
      .setDescription("Short description of the video")
      .setRequired(false),
  )
  .addStringOption(option =>
    option
      .setName(Options.GAME_LINK)
      .setDescription("Link to the game (used for non-Steam games)")
      .setRequired(false),
  );
