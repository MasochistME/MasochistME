import { DiscordInteraction, getErrorEmbed, getSuccessEmbed } from "arcybot";

import { getMemesFromAPI, deleteMemeFromAPI } from "api";

/**
 * Deletes a meme permanently from the database.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const memedelete = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const memes = await getMemesFromAPI();
  const memeIndex = Number(interaction.options.getString("memeindex"));

  if (isNaN(memeIndex)) {
    interaction.reply(
      getErrorEmbed(
        "Can't delete a meme",
        "The index you provided is not a number.",
      ),
    );
    return;
  }
  if (memeIndex > memes.length || memeIndex < 1) {
    interaction.reply(
      getErrorEmbed(
        "Can't delete a meme",
        "Meme with this number does not exist.",
      ),
    );
    return;
  }

  const memeToDelete = memes[memeIndex - 1];
  const memeToDeleteId = memeToDelete._id;

  try {
    await deleteMemeFromAPI(memeToDeleteId);
    interaction.reply(
      getSuccessEmbed(
        "Meme deleted!",
        `In case it was by mistake, the deleted meme was:\n\n${memeToDelete.meme}`,
      ),
    );
  } catch (e) {
    interaction.reply(
      getErrorEmbed("Something went wrong :C", "Try again later.", true),
    );
    console.log(e);
  }
};
