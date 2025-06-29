import { getRandomMemeFromAPI } from "api";
import { DiscordInteraction } from "arcybot";

/**
 * Sends a meme to the channel.
 * @param interaction DiscordInteraction
 * @return void
 */
export const meme = async (interaction: DiscordInteraction): Promise<void> => {
  const randomMeme = await getRandomMemeFromAPI();
  interaction.reply(`_ ${randomMeme} _`);
};
