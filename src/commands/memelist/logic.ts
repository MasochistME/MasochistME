import { DiscordInteraction } from "arcybot";

import { DISCORD_MAX_MSG_LENGTH } from "consts";
import { getMemesFromAPI } from "api";

/**
 * Shows a full list of all the memes.
 * @param interaction DiscordInteraction
 * @return void
 */
export const memelist = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  const channel = interaction.channel;
  const memes: string[] = [];
  (await getMemesFromAPI())
    .map((meme, index) => `**${index + 1}**. ${meme.meme}\n`)
    .reduce((acc: string, curr: string) => {
      if ((acc + curr).length < DISCORD_MAX_MSG_LENGTH) {
        acc += curr;
        return acc;
      }
      memes.push(acc);
      return curr;
    }, "");
  memes.forEach(chunk => channel?.send({ content: chunk }));
};
