import { DiscordInteraction } from "arcybot";

import { sdk } from "fetus";
import { Badge } from "@masochistme/sdk/dist/v1/types";
import { createError, ErrorAction } from "utils";
import { ImgType, saveImage } from "utils/saveImage";

/**
 * Creates a new badge.
 * @param interaction DiscordInteraction
 * @return void
 */
export const badgecreate = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const gameId = interaction.options.getString("game", true);
  const name = interaction.options.getString("name", true);
  const thumbnail = interaction.options.getAttachment("image", true)?.proxyURL;
  const isSteamGame = !isNaN(parseInt(gameId));

  try {
    // First we save a badge with just the Discord's attachment image.
    const badge: Omit<Badge, "_id"> = {
      name,
      gameId: isSteamGame ? Number(gameId) : null,
      requirements: interaction.options.getString("requirements", true),
      points: interaction.options.getNumber("points", true),
      description: interaction.options.getString("description", true),
      title: isSteamGame ? null : gameId,
      img: thumbnail,
      isEnabled: true,
      isLegacy: false,
      isSteamGame,
    };

    const { acknowledged, insertedId } = await sdk.createBadge({ badge });
    if (!acknowledged)
      throw new Error("Could not create a badge, please try again later.");
    // Then we update the badge image with the one stored on server.
    const badgeId = String(insertedId);
    const fixedImage = await saveImage(
      thumbnail,
      `${gameId}_${badgeId}`,
      ImgType.BADGE,
    );
    const { acknowledged: ackUpdate } = await sdk.updateBadgeById({
      badgeId,
      badge: { img: fixedImage },
    });
    if (!ackUpdate)
      throw "Could not save badge's image to server, please try again.";

    const disabledFields = [
      "game",
      "img",
      "enabled",
      "legacy",
      "isNonSteamGame",
    ];
    const embed = {
      title: "🥇 Badge created!",
      thumbnail: { url: fixedImage },
      fields: [
        ...Object.entries(badge)
          .filter(entry => !disabledFields.includes(entry[0]))
          .map(entry => ({
            name: entry[0],
            value: String(entry[1]),
            inline: true,
          })),
        {
          name: "---",
          value: `You have added a new badge! Its ID is ${insertedId}.`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
