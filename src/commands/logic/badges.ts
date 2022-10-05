import axios from "axios";
import { log, DiscordInteraction } from "arcybot";

import {
  getErrorEmbed,
  getSuccessEmbed,
  getBadgeNameById,
  getMemberNameById,
} from "utils";
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

/**
 * Gives a badge to a user with given id.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const badgegive = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  if (interaction.isAutocomplete()) return;
  await interaction.deferReply();

  const badgeId = interaction.options.getString("badge");
  const memberId = interaction.options.getString("member");

  const url = `${API_URL}/badges/badge/${badgeId}/user/${memberId}`;

  try {
    const badgeRes = await axios.put(url);
    if (badgeRes.status === 200)
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
    else throw badgeRes.data;
  } catch (err: any) {
    interaction.editReply(
      getErrorEmbed(
        `Error giving badge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}** to the user **${getMemberNameById(
          memberId,
        ).toUpperCase()}**.`,
        err,
        true,
      ),
    );
  }
};

/**
 * Removes a badge from a user with given id.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const badgerevoke = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  if (interaction.isAutocomplete()) return;
  await interaction.deferReply();

  const badgeId = interaction.options.getString("badge");
  const memberId = interaction.options.getString("member");

  const url = `${API_URL}/badges/badge/${badgeId}/user/${memberId}`;

  try {
    const badgeRes = await axios.delete(url);
    if (badgeRes.status === 200)
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
    else throw badgeRes.data;
  } catch (err: any) {
    interaction.editReply(
      getErrorEmbed(
        `Error removing badge **${getBadgeNameById(
          badgeId,
        ).toUpperCase()}** from the user **${getMemberNameById(
          memberId,
        ).toUpperCase()}**.`,
        err,
        true,
      ),
    );
  }
};
