import { DiscordInteraction } from "arcybot";

import {
  createError,
  ErrorAction,
  getBadgeNameById,
  ImgType,
  saveImage,
} from "utils";
import { sdk } from "fetus";
import { Badge } from "@masochistme/sdk/dist/v1/types";

/**
 * Edits an existing badge.
 * @param interaction DiscordInteraction
 * @return void
 */
export const badgeedit = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const badgeId = interaction.options.getString("badge", true);
  const name = interaction.options.getString("name", false);
  const description = interaction.options.getString("description", false);
  const points = interaction.options.getNumber("points", false);
  const requirements = interaction.options.getString("requirements", false);
  const image = interaction.options.getAttachment("image", false);

  try {
    const existingBadge = await sdk.getBadgeById({ badgeId });
    if (!existingBadge)
      throw new Error("Cannot edit a badge which does not exist.");

    const fixedImage = image
      ? await saveImage(
          image.proxyURL,
          `${existingBadge.gameId}_${badgeId}`,
          ImgType.BADGE,
        )
      : null;

    const newBadge: Partial<Badge> = {
      ...(name && { name }),
      ...(description && { description }),
      ...(points && { points }),
      ...(requirements && { requirements }),
      ...(fixedImage && { img: fixedImage }),
    };

    const response = await sdk.updateBadgeById({ badgeId, badge: newBadge });

    if (!response.acknowledged)
      throw new Error("Could not update the badge, please try again later.");

    const disabledFields = [
      "game",
      "img",
      "enabled",
      "legacy",
      "isNonSteamGame",
    ];
    const embed = {
      title: "🥇 Badge updated!",
      ...(newBadge.img && { thumbnail: { url: newBadge.img } }),
      fields: [
        ...Object.entries(newBadge)
          .filter(entry => !disabledFields.includes(entry[0]))
          .map(entry => ({
            name: entry[0],
            value: String(entry[1]),
            inline: true,
          })),
        {
          name: "---",
          value: `You have updated a **${getBadgeNameById(
            badgeId,
          ).toUpperCase()}** badge!`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.REPLY);
  }
};
