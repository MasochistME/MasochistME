import axios from "axios";
import { getErrorEmbed, DiscordInteraction, log } from "arcybot";

import { API_URL } from "consts";

/**
 * Creates a new badge.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const badgecreate = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const gameId = interaction.options.getString("game", true);
  const thumbnail = interaction.options.getAttachment("image", true);
  const isNonSteamGame = isNaN(parseInt(gameId));

  const data = {
    name: interaction.options.getString("name", true),
    gameId: isNonSteamGame ? null : gameId,
    requirements: interaction.options.getString("requirements", true),
    points: interaction.options.getNumber("points", true),
    description: interaction.options.getString("description", true),
    game: isNonSteamGame ? gameId : null,
    img: thumbnail.url,
    enabled: true,
    legacy: false,
    isNonSteamGame,
  };
  const url = `${API_URL}/badges`;

  try {
    const addBadge = await axios.post(url, data);
    if (addBadge.status !== 201) {
      throw addBadge.data;
    }
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
        ...Object.entries(data)
          .filter(entry => !disabledFields.includes(entry[0]))
          .map(entry => ({
            name: entry[0],
            value: String(entry[1]),
            inline: true,
          })),
        {
          name: "---",
          value: `You have added a new badge! Its ID is ${addBadge.data.insertedId}.`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    log.WARN(err);
    interaction.editReply(getErrorEmbed("Error saving badge", err, true));
  }
};
