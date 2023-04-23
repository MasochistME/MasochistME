import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import {
  getSeasonInactiveChoices,
  getSeasonActiveChoices,
} from "commands/_utils/season";

/**
 * Handles autocompletion for searching an inactive season
 * @param interaction
 * @return void
 */
export const seasonInactiveAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];

  const focused = interaction.options.getFocused(true);

  if (focused.name === "season")
    choices = getSeasonInactiveChoices(focused.value);

  await interaction.respond(choices);
};

/**
 * Handles autocompletion for searching an active season
 * @param interaction
 * @return void
 */
export const seasonActiveAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];

  const focused = interaction.options.getFocused(true);

  if (focused.name === "season")
    choices = getSeasonActiveChoices(focused.value);

  await interaction.respond(choices);
};
