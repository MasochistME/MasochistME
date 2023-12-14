import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from 'discord.js';

import {
  getCheeseReasonChoices,
  getGameChoices,
  getMemberChoices,
} from 'commands/_utils/choices';
import { Options } from './builder';
import { SELF } from 'commands/cheese/logic';

/**
 * Handles autocompletion for cheese commands
 * @param interaction
 * @return void
 */
export const cheeseAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);

  if (focused.name === Options.MEMBER)
    choices = [
      { name: '[ME]', value: SELF },
      ...getMemberChoices(focused.value),
    ];
  if (focused.name === Options.GAME) choices = getGameChoices(focused.value);
  if (focused.name === Options.REASON)
    choices = getCheeseReasonChoices(focused.value);

  await interaction.respond(choices);
};
