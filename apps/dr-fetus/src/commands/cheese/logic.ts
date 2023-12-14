import { getSuccessEmbed, DiscordInteraction, getErrorEmbed } from 'arcybot';
// @ts-ignore:next-line
import { createError, ErrorAction, getMemberNameById, isMod } from 'utils';

import { OptionCheeseType, Options } from './builder';
import { sdk } from 'fetus';

export const SELF = '__SELF';

/**
 * Cheese command. There are two subcommands and it's decided here
 * which one we want to use.
 * @param interaction DiscordInteraction
 * @return void
 */
export const cheese = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const cheeseCommandType = interaction.options.getSubcommand(true);

  if (cheeseCommandType === OptionCheeseType.GIVE)
    return cheeseGive(interaction);
  if (cheeseCommandType === OptionCheeseType.REMOVE)
    return cheeseRemove(interaction);
  throw 'Selected cheese action is not supported.';
};

const cheeseGive = async (interaction: DiscordInteraction): Promise<void> => {
  const gameId = interaction.options.getString(Options.GAME, true);
  const memberId = interaction.options.getString(Options.MEMBER, true);
  const points = interaction.options.getNumber(Options.POINTS, true);
  const reason = interaction.options.getString(Options.REASON, true);
  const isSelf = memberId === SELF;

  /**
   * Check if user can even use this command
   */
  if (!isSelf && !isMod(interaction)) {
    interaction.channel?.send(
      getErrorEmbed(
        "You can't do that",
        'This is a mod command. If you want to self-assign a cheese badge, choose "ME" in the member selection.',
      ),
    );
    return;
  }

  /**
   * Check if the selected game even exists
   */
  const isSteamGame = !isNaN(parseInt(gameId));
  if (!isSteamGame)
    throw new Error(
      'Only Steam games can have anti-cheese badges. Select the game from the list.',
    );

  const { acknowledged } = await sdk.giveCheeseToMemberById({
    gameId: Number(gameId),
    memberId,
    points,
    reason,
    isModAssigned: true, // This will always be true because it's a mod command
  });

  if (!acknowledged)
    throw new Error(
      'Could not give member an anti-cheese badge, please try again later.',
    );

  const memberName = isSelf
    ? '**you** are'
    : `**${getMemberNameById(memberId)}** is`;

  try {
    interaction.editReply(
      getSuccessEmbed(
        `Success!`,
        `Now everyone will know that ${memberName} a filthy cheater.`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

const cheeseRemove = async (interaction: DiscordInteraction): Promise<void> => {
  const gameId = interaction.options.getString(Options.GAME, true);
  const memberId = interaction.options.getString(Options.MEMBER, true);
  const isSelf = memberId === SELF;

  /**
   * Check if user can even use this command
   */
  if (!isSelf && !isMod(interaction)) {
    interaction.channel?.send(
      getErrorEmbed(
        "You can't do that",
        'This is a mod command. If you want to self-remove a cheese badge, choose "ME" in the member selection.',
      ),
    );
    return;
  }

  /**
   * Check if the selected game even exists
   */
  const isSteamGame = !isNaN(parseInt(gameId));
  if (!isSteamGame)
    throw new Error(
      'Only Steam games can have anti-cheese badges. Select the game from the list.',
    );

  /**
   * Check if the badge is mod-assigned, if yes user cannot self-remove it
   */
  const memberCheeseList = await sdk.getMemberCheeseList({
    steamId: memberId,
  });

  const isModAssigned =
    memberCheeseList.find(cheese => cheese.gameId === Number(gameId))
      ?.isModAssigned ?? false;

  if (isSelf && isModAssigned) {
    interaction.channel?.send(
      getErrorEmbed(
        "You can't do that",
        `This anti-cheese badge was assigned to you by moderator, so you cannot remove it yourself.
        If you were this moderator, tough luck, I'm too lazy to code it. Ask some other mod to remove it from you.`,
      ),
    );
    return;
  }

  /**
   * All edge cases are checked. Now we can revoke the cheese from member!
   */
  const { acknowledged } = await sdk.revokeCheeseFromMemberById({
    memberId,
    gameId: Number(gameId),
  });

  if (!acknowledged)
    throw new Error(
      'Could not give member an anti-cheese badge, please try again later.',
    );

  try {
    interaction.editReply(
      getSuccessEmbed(
        'Success!',
        `**${getMemberNameById(
          memberId,
        )}** is no longer recognized as a dirty cheeser.`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
