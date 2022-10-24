import { getSuccessEmbed, DiscordInteraction } from "arcybot";

import { createError, ErrorAction } from "utils";
import { sdk } from "fetus";
import { Options } from "./builder";

/**
 * Allows a moderator to start a new season.
 * @param interaction DiscordInteraction
 * @return void
 */
export const seasonstart = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();
  try {
    const seasonId = interaction.options.getString(Options.SEASON_ID, true);
    const seasonList = await sdk.getSeasonsList({ filter: { inactive: true } });
    const specifiedSeason = seasonList.find(
      season => seasonId === String(season._id),
    );

    if (!specifiedSeason)
      throw new Error(
        `Race with the name **${seasonId.toUpperCase()}** does not exist.`,
      );
    if (specifiedSeason?.startDate)
      throw new Error("You cannot start a season which is already started.");

    const response = await sdk.startSeasonById({ seasonId });

    if (!response.acknowledged)
      throw new Error("Could not start a new season, please try again later.");

    interaction.editReply(
      getSuccessEmbed(
        "Success",
        `You officially started season **${specifiedSeason.name.toUpperCase()}**!`,
      ),
    );
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
