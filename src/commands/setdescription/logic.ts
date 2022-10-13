import { getSuccessEmbed, DiscordInteraction } from "arcybot";

import { sdk } from "fetus";
import { createError, ErrorAction } from "utils";

/**
 * Allows the user to set a custom description on their Masochist.ME profile.
 * @param interaction DiscordInteraction
 * @return void
 */
export const setdescription = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  const description = interaction.options.getString("description", true);

  try {
    const member = await sdk.getMemberById({ discordId: interaction.user.id });
    const steamId = member?.steamId;
    if (!steamId)
      throw "Could not find your Masochist.ME user data. You might have not connected your Discord account with Masochist.ME one - to do so, use the `/register` command.";
    const response = await sdk.updateMemberById({
      memberId: interaction.user.id,
      member: { description },
    });
    if (!response.acknowledged)
      throw "Cannot update member's description, please try again later.";

    interaction.editReply(
      getSuccessEmbed(
        "New description is set!",
        `Now everyone will be able to see that <@${interaction.user.id}> describes themselves as:\n\n***"${description}"***\n\n`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
