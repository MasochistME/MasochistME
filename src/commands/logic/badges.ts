import axios from "axios";
import { DiscordInteraction } from "arcybot";

import { getErrorEmbed, getSuccessEmbed } from "utils";
import { API_URL } from "consts";

/**
 * Gives a badge to a user with given id.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const givebadge = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  if (interaction.isAutocomplete()) return;
  await interaction.deferReply({ ephemeral: true });

  const badgeId = interaction.options.getString("badge");
  const memberId = interaction.options.getString("member");

  const url = `${API_URL}/badges/badge/${badgeId}/user/${memberId}`;

  try {
    const badgeRes = await axios.put(url);
    if (badgeRes.status === 200)
      interaction.editReply(
        getSuccessEmbed(
          "Badge given!",
          `Member ${memberId} now has badge ${badgeId}!`,
        ),
      );
    else throw badgeRes.data;
  } catch (err: any) {
    interaction.editReply(
      getErrorEmbed("Error giving badge to the user", err, true),
    );
  }
};

/**
 * Removes a badge from a user with given id.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const revokebadge = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  if (interaction.isAutocomplete()) return;
  await interaction.deferReply({ ephemeral: true });

  const badgeId = interaction.options.getString("badge");
  const memberId = interaction.options.getString("member");

  const url = `${API_URL}/badges/badge/${badgeId}/user/${memberId}`;

  try {
    const badgeRes = await axios.delete(url);
    if (badgeRes.status === 200)
      interaction.editReply(
        getSuccessEmbed(
          "Badge removed!",
          `Member ${memberId} no longer has badge ${badgeId}!`,
        ),
      );
    else throw badgeRes.data;
  } catch (err: any) {
    interaction.editReply(
      getErrorEmbed("Error removing badge from the user", err, true),
    );
  }
};
