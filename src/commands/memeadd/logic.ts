import { DiscordInteraction, getErrorEmbed, getSuccessEmbed } from "arcybot";

import { addMemeToAPI } from "api";

/**
 * Adds a new meme to the database.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const memeadd = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  try {
    const meme = interaction.options.getString("meme");
    if (!meme) throw new Error("You did not provide a meme.");
    await addMemeToAPI(meme);
    interaction.reply(getSuccessEmbed("Meme added!", meme));
  } catch (e) {
    interaction.reply(
      getErrorEmbed("Something went wrong :C", "Try again later.", true),
    );
    console.log(e);
  }
};
