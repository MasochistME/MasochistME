import { getRaceChoices } from 'commands/_utils/choices';
import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
} from 'discord.js';

/**
 * Handles autocompletion for the "race" command.
 * @param interaction
 * @return void
 */
export const raceAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);

  if (focused.name === 'race') choices = getRaceChoices(focused.value);

  await interaction.respond(choices);
};
