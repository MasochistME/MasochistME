import { getSuccessEmbed, DiscordInteraction } from "arcybot";

import {
  createError,
  ErrorAction,
  getBadgeNameById,
  getMemberNameById,
} from "utils";
import { sdk } from "fetus";

/**
 * Removes a badge from a user with given id.
 * @param interaction DiscordInteraction
 * @return void
 */
export const badgerevoke = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  if (interaction.isAutocomplete()) return;
  await interaction.deferReply();

  const badgeId = interaction.options.getString("badge", true);
  const memberId = interaction.options.getString("member", true);

  try {
    const response = await sdk.revokeBadgeFromMemberById({ memberId, badgeId });
    if (!response.acknowledged)
      throw new Error(
        "Could not remove badge from this member, please try again later.",
      );
    interaction.editReply(
      getSuccessEmbed(
        "Badge removed!",
        `Member **${getMemberNameById(
          memberId,
        ).toUpperCase()}** no longer has badge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}**!`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};
