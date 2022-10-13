import { DiscordInteraction, getSuccessEmbed } from "arcybot";

import { addMemeToAPI } from "api";
import { createError, ErrorAction } from "utils";

/**
 * Adds a new meme to the database.
 * @param interaction DiscordInteraction
 * @return void
 */
export const memeadd = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  try {
    const meme = interaction.options.getString("meme");
    if (!meme) throw new Error("You did not provide a meme.");
    await addMemeToAPI(meme);
    interaction.reply(getSuccessEmbed("Meme added!", meme));
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};
