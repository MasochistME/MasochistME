import { getSuccessEmbed, DiscordInteraction } from "arcybot";

import { sdk } from "fetus";
import { createError, ErrorAction, getBadgeNameById } from "utils";

/**
 * Removes an existing badge.
 * @param interaction DiscordInteraction
 * @return void
 */
export const badgedelete = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  try {
    const badgeId = interaction.options.getString("badge", true);
    const response = await sdk.deleteBadgeById({ badgeId });
    if (!response.acknowledged)
      throw new Error("Could not delete the badge, please try again later.");
    interaction.editReply(
      getSuccessEmbed(
        "Badge deleted",
        `Done, fucker.\nBadge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}** permanently deleted.\nEvery member which had this badge also had it removed.`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
