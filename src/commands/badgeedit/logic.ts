import axios from "axios";
import { getErrorEmbed, DiscordInteraction } from "arcybot";

import { getBadgeNameById } from "utils";
import { API_URL } from "consts";

/**
 * Edits an existing badge.
 * @param interaction DiscordInteraction
 * @returns void
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

  const url = `${API_URL}/badges/${badgeId}`;

  try {
    const getBadge = await axios.get(url);
    if (getBadge.status !== 200) throw getBadge.data;

    const newBadge = {
      ...getBadge.data,
      ...(name && { name }),
      ...(description && { description }),
      ...(points && { points }),
      ...(requirements && { requirements }),
      ...(image && { img: image.url }),
    };
    delete newBadge._id;

    const updateBadge = await axios.put(url, newBadge);
    if (updateBadge.status !== 200) throw updateBadge.data;

    const disabledFields = [
      "game",
      "img",
      "enabled",
      "legacy",
      "isNonSteamGame",
    ];
    const embed = {
      title: "🥇 Badge updated!",
      thumbnail: { url: newBadge.img },
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
          )?.toUpperCase()}** badge!`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    console.trace(err);
    interaction.editReply(
      getErrorEmbed(
        `Error updating the badge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}**`,
        err,
        true,
      ),
    );
  }
};
