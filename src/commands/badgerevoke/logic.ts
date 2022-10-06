import axios from "axios";
import { getErrorEmbed, getSuccessEmbed, DiscordInteraction } from "arcybot";

import { getBadgeNameById, getMemberNameById } from "utils";
import { API_URL } from "consts";

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
