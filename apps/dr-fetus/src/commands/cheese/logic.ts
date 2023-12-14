import { getSuccessEmbed, DiscordInteraction } from 'arcybot';
import {
  createError,
  ErrorAction,
  getMemberNameById,
  getMemberSteamByDiscordId,
  isMod,
} from 'utils';

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

/**
 * Give cheese to user. Can be used for self-assign
 */
const cheeseGive = async (interaction: DiscordInteraction): Promise<void> => {
  const gameId = interaction.options.getString(Options.GAME, true);
  const memberId = interaction.options.getString(Options.MEMBER, true);
  const points = interaction.options.getNumber(Options.POINTS, true);
  const reason = interaction.options.getString(Options.REASON, false) ?? '';
  const isSelf = memberId === SELF;

  try {
    /**
     * Check if user can even use this command
     */
    if (!isSelf && !isMod(interaction)) {
      throw new Error(
        'This is a mod command. If you want to self-assign a cheese badge, choose "ME" in the member selection.',
      );
    }

    /**
     * Check if the selected game even exists
     */
    const isSteamGame = !isNaN(parseInt(gameId));
    if (!isSteamGame) {
      throw new Error(
        'Only Steam games can have anti-cheese badges. Select the game from the list.',
      );
    }

    /**
     * All edge cases are handled. Now we can give the cheese to member!
     */
    const { acknowledged } = await sdk.giveCheeseToMemberById({
      gameId: Number(gameId),
      memberId: isSelf
        ? getMemberSteamByDiscordId(interaction.user.id) ?? memberId
        : memberId,
      points: Math.abs(points) * -1,
      reason,
      isModAssigned: true, // This will always be true because it's a mod command
    });

    if (!acknowledged) {
      throw new Error(
        'Could not give member an anti-cheese badge, please try again later.',
      );
    }

    const memberName = isSelf
      ? '**you** are'
      : `**${getMemberNameById(memberId)}** is`;

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

/**
 * Give cheese to user. Can be used for self-remove
 */
const cheeseRemove = async (interaction: DiscordInteraction): Promise<void> => {
  const gameId = interaction.options.getString(Options.GAME, true);
  const memberId = interaction.options.getString(Options.MEMBER, true);
  const isSelf = memberId === SELF;

  const fixedSteamId = isSelf
    ? getMemberSteamByDiscordId(interaction.user.id) ?? memberId
    : memberId;

  try {
    /**
     * Check if user can even use this command
     */
    if (!isSelf && !isMod(interaction)) {
      throw new Error(
        'This is a mod command. If you want to self-remove a cheese badge, choose "ME" in the member selection.',
      );
    }

    /**
     * Check if the selected game even exists
     */
    const isSteamGame = !isNaN(parseInt(gameId));
    if (!isSteamGame) {
      throw new Error(
        'Only Steam games can have anti-cheese badges. Select the game from the list.',
      );
    }

    /**
     * Check if the badge is mod-assigned, if yes user cannot self-remove it
     */
    const memberCheeseList = await sdk.getMemberCheeseList({
      steamId: fixedSteamId,
    });

    const isModAssigned =
      memberCheeseList.find(cheese => cheese.gameId === Number(gameId))
        ?.isModAssigned ?? false;

    if (isSelf && isModAssigned && !isMod(interaction)) {
      throw new Error(
        `This anti-cheese badge was assigned to you by moderator, so you cannot remove it yourself.`,
      );
    }

    /**
     * All edge cases are handled. Now we can revoke the cheese from member!
     */
    const { acknowledged } = await sdk.revokeCheeseFromMemberById({
      memberId: fixedSteamId,
      gameId: Number(gameId),
    });

    if (!acknowledged)
      throw new Error(
        'Could not give member an anti-cheese badge, please try again later.',
      );

    interaction.editReply(
      getSuccessEmbed(
        'Success!',
        `**${getMemberNameById(
          fixedSteamId,
        )}** is no longer recognized as a dirty cheeser.`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
