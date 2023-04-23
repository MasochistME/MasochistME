import { DiscordInteraction } from "arcybot";
import { Season } from "@masochistme/sdk/dist/v1/types";

import { createError, ErrorAction, ImgType, saveImage } from "utils";
import { sdk } from "fetus";

import { Options } from "./builder";

/**
 * Describe your "seasoncreate" command here.
 * @param interaction DiscordInteraction
 * @return void
 */
export const seasoncreate = async (
  interaction: DiscordInteraction,
): Promise<void> => {
  await interaction.deferReply();

  try {
    const icon = interaction.options.getAttachment(Options.ICON, true);
    if (!icon.contentType?.includes("image/"))
      throw "This type of file is not supported as a season icon. You need to upload an image.";
    // First we just create a season
    const rawSeason: Omit<Season, "_id"> = {
      name: interaction.options.getString(Options.NAME, true),
      description: interaction.options.getString(Options.DESCRIPTION, true),
      icon: icon.proxyURL,
      isSpecial: interaction.options.getBoolean(Options.IS_SPECIAL, true),
      startDate: null,
      endDate: null,
    };

    const { acknowledged: ackCreate, insertedId } = await sdk.createSeason({
      season: rawSeason,
    });

    if (!ackCreate)
      throw new Error("Could not create a season, please try again later.");

    // Then, after we get ID of newly created season,
    // we can update it with a new server-stored icon
    const seasonId = String(insertedId);
    const savedIcon = await saveImage(
      interaction.options.getAttachment(Options.ICON, true).proxyURL,
      seasonId,
      ImgType.ICON_SEASON,
    );
    // We don't throw if this does not work because season icon is not something crucial
    await sdk.updateSeasonById({
      seasonId: String(insertedId),
      season: { icon: savedIcon },
    });

    const embed = {
      title: `ℹ️ New season created!`,
      thumbnail: { url: savedIcon },
      fields: [
        { name: "Name", value: rawSeason.name },
        { name: "Description", value: rawSeason.description },
        { name: "Special season", value: String(rawSeason.isSpecial) },
        {
          name: "---",
          value: `You have created a new season - **${rawSeason.name}**!.
          \nIt is not yet started - first update the bot with \`\`/update\`\` command, and then - when you're ready - use the \`\`/seasonstart\`\` command.
          \nStarting a new season **will not** end any of the other ongoing seasons.`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
