import { getSuccessEmbed, DiscordInteraction } from "arcybot";
// @ts-ignore:next-line
import { createError, ErrorAction } from "utils";

import { Options } from "./builder";

/**
 * Describe your "iam" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const iam = async (interaction: DiscordInteraction): Promise<void> => {
  await interaction.deferReply();

  const role = interaction.options.getString(Options.ROLE_SELF_ASSIGN, true);

  try {
    interaction.editReply(
      getSuccessEmbed("Success", `Your command worked! ${role}`),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

/**
 * Describe your "iamnot" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const iamnot = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const role = interaction.options.getString(Options.ROLE_SELF_ASSIGN, true);

  try {
    interaction.editReply(
      getSuccessEmbed("Success", `Your command worked! ${role}`),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
