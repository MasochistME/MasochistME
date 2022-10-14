import { getSuccessEmbed, DiscordInteraction } from "arcybot";
import { sdk } from "fetus";
import { createError, ErrorAction } from "utils";

/**
 * Ends an active season, if such exists.
 * @param interaction DiscordInteraction
 * @return void
 */
export const seasonend = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  try {
    const response = await sdk.endActiveSeason();
    if (!response.acknowledged)
      throw new Error(
        "Could not finish an active season, please try again later.",
      );

    interaction.editReply(getSuccessEmbed("Success", `You finished a season!`));
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

// TODO Add sending public leaderboards at the end of a season maybe?
