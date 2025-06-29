import { getBadgeChoices } from 'commands/_utils/choices';
import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from 'discord.js';

/**
 * Handles autocompletion for the badge edit commands
 * @param interaction
 * @return void
 */
export const badgeEditAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);
  if (focused.name === 'badge') choices = getBadgeChoices(focused.value);

  await interaction.respond(choices);
};
