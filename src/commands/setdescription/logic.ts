import axios from "axios";
import {
  getSuccessEmbed,
  getErrorEmbed,
  DiscordInteraction,
  log,
} from "arcybot";

import { API_URL } from "consts";
import { getMemberFromAPI } from "api";

/**
 * Allows the user to set a custom description on their Masochist.ME profile.
 * @param interaction DiscordInteraction
 * @returns void
 */
export const setdescription = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const description = interaction.options.getString("description", true);

  try {
    const member = await getMemberFromAPI(interaction.user.id);
    const steamId = member?.id;
    if (!steamId)
      throw "Could not find your Masochist.ME user data. You might have not connected your Discord account with Masochist.ME one - to do so, use the `/register` command.";
    const rankingUrl = `${API_URL}/users/user/${steamId}`;
    const setMemberDescription = await axios.put(rankingUrl, { description });
    if (setMemberDescription.status !== 200) throw setMemberDescription.data;

    interaction.editReply(
      getSuccessEmbed(
        "New description is set!",
        `Now everyone will be able to see that <@${interaction.user.id}> describes themselves as:\n\n***"${description}"***\n\n`,
      ),
    );
  } catch (err: any) {
    interaction.editReply(getErrorEmbed("Error", err, true));
  }
};
