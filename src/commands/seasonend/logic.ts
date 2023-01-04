import { getSuccessEmbed, DiscordInteraction } from "arcybot";

import { createError, ErrorAction } from "utils";
import { sdk } from "fetus";
import { Options } from "./builder";

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
    const seasonId = interaction.options.getString(Options.SEASON_ID, true);
    const seasonList = await sdk.getSeasonsList({ filter: { active: true } });
    const specifiedSeason = seasonList.find(
      season => seasonId === String(season._id),
    );

    if (!specifiedSeason)
      throw new Error(
        `Race with the ID **${seasonId.toUpperCase()}** does not exist.`,
      );
    if (specifiedSeason?.endDate)
      throw new Error("You cannot finish a season which is already finished.");

    const response = await sdk.endSeasonById({ seasonId });

    if (!response.acknowledged)
      throw new Error(
        "Could not finish an active season, please try again later.",
      );

    interaction.editReply(
      getSuccessEmbed(
        "Success",
        `You officially finished season **${specifiedSeason.name.toUpperCase()}**!`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};

// TODO Add sending public leaderboards at the end of a season maybe?
