import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { getGameChoices } from "commands/_utils/choices";

/**
 * Handles autocompletion for the create badge command
 * @param interaction
 * @return void
 */
export const badgeCreateAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);
  if (focused.name === "game") choices = getGameChoices(focused.value);

  await interaction.respond(choices);
};
