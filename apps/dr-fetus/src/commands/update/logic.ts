import { DiscordInteraction, getAwaitEmbed, getSuccessEmbed } from "arcybot";

import { bot, cache } from "fetus";
import { createError, ErrorAction } from "utils";

/**
 * Sends a meme to the channel.
 * @param interaction DiscordInteraction
 * @return void
 */
export const update = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();
  interaction.editReply(
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
    createError(interaction, err, ErrorAction.EDIT);
  }
};
