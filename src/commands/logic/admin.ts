import {
  DiscordInteraction,
  getErrorEmbed,
  getAwaitEmbed,
  getSuccessEmbed,
} from "arcybot";

import { bot, cache } from "fetus";

/**
 * Sends a meme to the channel.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const update = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await bot.commands.removeGuildCommands();
  await bot.commands.removeGlobalCommands();
  interaction.reply(
    getAwaitEmbed(
      "Updating...",
      "⏳ Updating cache...\n⏳ Updating command list...",
    ),
  );
  try {
    await cache.update();
    interaction.editReply(
      getAwaitEmbed(
        "Updating...",
        "✅ Updating cache...\n⏳ Updating command list...",
      ),
    );
    await bot.commands.register();
    interaction.editReply(
      getSuccessEmbed(
        "Done!",
        "✅ Updating cache...\n✅ Updating command list...\n\nUpdate successfully completed!",
      ),
    );
  } catch (err: any) {
    interaction.editReply(getErrorEmbed("Could not update cache", err));
  }
};
