import { DiscordInteraction } from "arcybot";

import { DISCORD_MAX_MSG_LENGTH } from "consts";
import { getErrorEmbed, getSuccessEmbed } from "utils";
import {
  getMemesFromAPI,
  getRandomMemeFromAPI,
  addMemeToAPI,
  deleteMemeFromAPI,
} from "api";

export const meme = async (interaction: DiscordInteraction): Promise<void> => {
  const randomMeme = await getRandomMemeFromAPI();
  interaction.reply(`_ ${randomMeme} _`);
};

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

export const addmeme = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  try {
    const meme = interaction.options.getString("meme");
    if (!meme) throw new Error("You did not provide a meme.");
    await addMemeToAPI(meme);
    interaction.reply(getSuccessEmbed("Meme added!", meme, true));
  } catch (e) {
    interaction.reply(
      getErrorEmbed("Something went wrong :C", "Try again later.", true),
    );
    console.log(e);
  }
};

export const deletememe = async (
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
        true,
      ),
    );
  } catch (e) {
    interaction.reply(
      getErrorEmbed("Something went wrong :C", "Try again later.", true),
    );
    console.log(e);
  }
};
