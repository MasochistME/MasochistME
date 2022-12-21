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
  const thumbnail = interaction.options.getAttachment("image", true);
  const isSteamGame = !isNaN(parseInt(gameId));

  try {
    const fixedImage = await saveImage(
      thumbnail.proxyURL,
      `${gameId}_${name.replace(" ", "-")}`,
      ImgType.BADGE,
    );

    const badge: Omit<Badge, "_id"> = {
      name,
      gameId: isSteamGame ? Number(gameId) : null,
      requirements: interaction.options.getString("requirements", true),
      points: interaction.options.getNumber("points", true),
      description: interaction.options.getString("description", true),
      title: isSteamGame ? null : gameId,
      img: fixedImage,
      isEnabled: true,
      isLegacy: false,
      isSteamGame,
    };

    const response = await sdk.createBadge({ badge });
    if (!response.acknowledged)
      throw new Error("Could not create a badge, please try again later.");
    const disabledFields = [
      "game",
      "img",
      "enabled",
      "legacy",
      "isNonSteamGame",
    ];
    const embed = {
      title: "🥇 Badge created!",
      thumbnail: { url: thumbnail.url },
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
          value: `You have added a new badge! Its ID is ${response.insertedId}.`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
