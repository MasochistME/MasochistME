import axios from "axios";
import {
  getErrorEmbed,
  getSuccessEmbed,
  DiscordInteraction,
  log,
} from "arcybot";

import { getBadgeNameById } from "utils";
import { API_URL } from "consts";

/**
 * Removes an existing badge.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const badgedelete = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const badgeId = interaction.options.getString("badge", true);

  const url = `${API_URL}/badges/${badgeId}`;
  try {
    const deleteBadge = await axios.delete(url);
    if (deleteBadge.status !== 204) {
      throw deleteBadge.data;
    }
    interaction.editReply(
      getSuccessEmbed(
        "Badge deleted",
        `Done, fucker.\nBadge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}** permanently deleted.\n**Important**: If any user had this badge assigned, they will still have it, but it won't display on their profile anymore. `,
      ),
    );
  } catch (err: any) {
    log.WARN(err);
    interaction.editReply(
      getErrorEmbed(
        `Error deleting badge **${getBadgeNameById(badgeId).toUpperCase()}**`,
        err,
        true,
      ),
    );
  }
};
