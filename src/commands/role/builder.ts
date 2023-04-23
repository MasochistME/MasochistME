import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

export enum Options {
  SUBCOMMAND_ASSIGN = "assign",
  SUBCOMMAND_REMOVE = "remove",
  ROLE_SELF = "role",
}

/**
 * Builder for the custom "role" command.
 */
export const roleBuilder = new SlashCommandBuilder()
  .setName("role")
  .addSubcommand((subcommand: SlashCommandSubcommandBuilder) => {
    return subcommand
      .setName(Options.SUBCOMMAND_ASSIGN)
      .setDescription(
        "Allows you to self-assign one of the allowed roles to yourself.",
      )
      .addStringOption(option =>
        option
          .setName(Options.ROLE_SELF)
          .setDescription("Role that you want to self-assign.")
          .setRequired(true)
          .setAutocomplete(true),
      );
  })
  .addSubcommand((subcommand: SlashCommandSubcommandBuilder) => {
    return subcommand
      .setName(Options.SUBCOMMAND_REMOVE)
      .setDescription(
        "Allows you to remove one of the allowed roles from yourself.",
      )
      .addStringOption(option =>
        option
          .setName(Options.ROLE_SELF)
          .setDescription("Role that you want to self-remove.")
          .setRequired(true)
          .setAutocomplete(true),
      );
  });
