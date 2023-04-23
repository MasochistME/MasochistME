import { getErrorEmbed } from "arcybot";
import {
  ButtonInteraction,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { isMod } from "utils";
import { getGameChoices } from "commands/_utils/choices";
import { sdk } from "fetus";
import { FEATURE_VIDEO } from "consts";

/**
 * Handles autocompletion for attaching a game to the posted video.
 * @param interaction
 * @return void
 */
export const vidGameAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);
  if (focused.name === "game") choices = getGameChoices(focused.value);

  await interaction.respond(choices);
};

/**
 * Handles autocompletion for the feature video
 * @param interaction
 * @return void
 */
export const featureVideo = async (
  interaction: ButtonInteraction,
): Promise<void> => {
  if (!interaction.isButton()) return;
  if (!isMod(interaction)) {
    interaction.reply(
      getErrorEmbed(
        "You can't do that",
        `Only a moderator can perform this action.`,
        true,
      ),
    );
    return;
  }

  const featuredId = interaction.customId.replace(`${FEATURE_VIDEO}_`, "");
  if (featuredId === interaction.customId) {
    // There is no ID attached to the button, cannot feature video
    interaction.reply(
      getErrorEmbed(
        "Could not feature this video",
        "Could not find a relevant entity in the data base. This won't work without reposting the video again.",
        true,
      ),
    );
    return;
  }

  const featuredData = await sdk.updateFeaturedById({
    featuredId,
    featured: { isApproved: true, isVisible: true, date: new Date() },
  });

  if (!featuredData.acknowledged) {
    interaction.reply(
      getErrorEmbed(
        "Error",
        "Could not create a featured post out of this video. Please try again later.",
        true,
      ),
    );
    return;
  }
  interaction.update({
    content:
      interaction.message.content +
      `\n\n✅ _${new Date().toLocaleString()} • featured by <@${
        interaction.user.id
      }>_`,
    components: [],
  });
};
