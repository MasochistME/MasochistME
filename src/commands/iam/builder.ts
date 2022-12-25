import { SlashCommandBuilder } from "discord.js";

export enum Options {
  ROLE_SELF_ASSIGN = "role-assign",
}

/**
 * Builder for the custom "iam" command.
 */
export const iamBuilder = new SlashCommandBuilder()
  .setName("iam")
  .addStringOption(option =>
    option
      .setName(Options.ROLE_SELF_ASSIGN)
      .setDescription("Role that you want to self-assign.")
      .setRequired(true)
      .setAutocomplete(true),
  );

/**
 * Builder for the custom "iamnot" command.
 */
export const iamnotBuilder = new SlashCommandBuilder()
  .setName("iamnot")
  .addStringOption(option =>
    option
      .setName(Options.ROLE_SELF_ASSIGN)
      .setDescription("Role that you want to self-remove.")
      .setRequired(true)
      .setAutocomplete(true),
  );
