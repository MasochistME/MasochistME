import { getSuccessEmbed, DiscordInteraction } from "arcybot";
// @ts-ignore:next-line
import { createError, ErrorAction } from "utils";

import { Options } from "./builder";

/**
 * Describe your "template" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const template = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const stringoption = interaction.options.getString(
    Options.STRING_OPTION,
    true,
  );
  const numberoption = interaction.options.getNumber(
    Options.NUMBER_OPTION,
    true,
  );

  try {
    interaction.editReply(
      getSuccessEmbed(
        "Success",
        `Your command worked! ${stringoption} + ${numberoption}`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
