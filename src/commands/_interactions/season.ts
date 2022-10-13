import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { getSeasonChoices } from "commands/_utils/season";

/**
 * Handles autocompletion for the season interaction commands
 * @param interaction
 * @return void
 */
export const seasonAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];

  const focused = interaction.options.getFocused(true);

  if (focused.name === "season") choices = getSeasonChoices(focused.value);

  await interaction.respond(choices);
};
