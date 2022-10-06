import axios from "axios";
import { getErrorEmbed, getSuccessEmbed, DiscordInteraction } from "arcybot";

import { getBadgeNameById, getMemberNameById } from "utils";
import { API_URL } from "consts";

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
