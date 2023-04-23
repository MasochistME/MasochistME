import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { getBadgeChoices, getMemberChoices } from "commands/_utils/choices";

/**
 * Handles autocompletion for the badge-user interaction commands
 * @param interaction
 * @return void
 */
export const badgeAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];

  const focused = interaction.options.getFocused(true);

  if (focused.name === "badge") choices = getBadgeChoices(focused.value);
  if (focused.name === "member") choices = getMemberChoices(focused.value);

  await interaction.respond(choices);
};
