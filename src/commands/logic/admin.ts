import { DiscordInteraction } from "arcybot";

import { cache } from "fetus";
import { getErrorEmbed, getSuccessEmbed } from "utils";

/**
 * Sends a meme to the channel.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const update = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  interaction.deferReply({ ephemeral: true });
  try {
    await cache.update();
    interaction.editReply(
      getSuccessEmbed("Success", "Cache updated successfully!"),
    );
  } catch (err: any) {
    interaction.editReply(getErrorEmbed("Could not update cache", err));
  }
};
