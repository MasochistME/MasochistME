import { DiscordInteraction } from "arcybot";
import { Season } from "@masochistme/sdk/dist/v1/types";

import { createError, ErrorAction } from "utils";
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

  const season: Pick<Season, "name" | "description" | "icon"> = {
    name: interaction.options.getString(Options.NAME, true),
    description: interaction.options.getString(Options.DESCRIPTION, true),
    icon: interaction.options.getAttachment(Options.ICON, true).url,
  };

  try {
    const response = await sdk.createSeason({ season });
    if (!response.acknowledged)
      throw new Error("Could not create a season, please try again later.");
    const embed = {
      title: `ℹ️ New season created!`,
      thumbnail: { url: season.icon },
      fields: [
        { name: "Name", value: season.name },
        { name: "Name", value: season.description },
        {
          name: "---",
          value: `You have created a new season! Its ID is **${response.insertedId}**.
          \nIt is not yet started - you can start it when you're ready with the \`\`/seasonstart <season_id>\`\` command.
          \nStarting a new race causes the old one to automatically end.`,
        },
      ],
    };
    interaction.editReply({ embeds: [embed] });
  } catch (err: any) {
    createError(interaction, err, ErrorAction.EDIT);
  }
};
