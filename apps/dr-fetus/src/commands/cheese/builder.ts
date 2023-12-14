import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

export enum Options {
  MEMBER = 'member',
  GAME = 'game',
  REASON = 'reason',
  POINTS = 'points',
}
export enum OptionCheeseType {
  GIVE = 'give',
  REMOVE = 'remove',
}

const getCommonOptions = (subcommand: SlashCommandSubcommandBuilder) => {
  return subcommand
    .addStringOption(option =>
      option
        .setName(Options.MEMBER)
        .setDescription('Member to get the cheese')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption(option =>
      option
        .setName(Options.GAME)
        .setDescription('Game for which the cheese is for')
        .setRequired(true)
        .setAutocomplete(true),
    );
};

/**
 * Builder for the custom "cheese" command.
 */
export const cheeseBuilder = new SlashCommandBuilder()
  .setName('cheese')
  .addSubcommand(subcommand => {
    const subcommandWithCommonOptions = getCommonOptions(subcommand)
      .setName(OptionCheeseType.GIVE)
      .setDescription('Give an anti-cheese badge to a member.')
      .addStringOption(option =>
        option
          .setName(Options.REASON)
          .setDescription(
            'Reason why this member deserves a filthy cheater shame badge',
          )
          .setRequired(true)
          .setAutocomplete(true),
      )
      .addNumberOption(option =>
        option
          .setName(Options.POINTS)
          .setDescription('Amount of negative points')
          .setRequired(true),
      );
    return subcommandWithCommonOptions;
  })
  .addSubcommand(subcommand => {
    const subcommandWithCommonOptions = getCommonOptions(subcommand)
      .setName(OptionCheeseType.REMOVE)
      .setDescription('Remove an anti-cheese badge from a member.');
    return subcommandWithCommonOptions;
  });
