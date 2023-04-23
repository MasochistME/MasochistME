import { getSuccessEmbed, DiscordInteraction } from "arcybot";

import {
  createError,
  ErrorAction,
  getBadgeNameById,
  getMemberNameById,
} from "utils";
import { sdk } from "fetus";

/**
 * Gives a badge to a user with given id.
 * @param interaction DiscordInteraction
 * @return void
 */
export const badgegive = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  if (interaction.isAutocomplete()) return;
  await interaction.deferReply();

  const badgeId = interaction.options.getString("badge", true);
  const memberId = interaction.options.getString("member", true);

  try {
    const response = await sdk.giveBadgeToMemberById({ memberId, badgeId });
    if (!response.acknowledged)
      throw new Error(
        "Could not give the badge to the member, please try again later.",
      );
    interaction.editReply(
      getSuccessEmbed(
        "Badge given!",
        `Member **${getMemberNameById(
          memberId,
        ).toUpperCase()}** now has badge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}**!`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
