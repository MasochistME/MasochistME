import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { getFilteredChoices } from "commands/_utils";
import { Options } from "commands/iam/builder";

/**
 * Handles autocompletion for the "iam" command.
 * @param interaction
 * @return void
 */
export const roleAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [
    { name: "role", value: "role" },
  ];
  const focused = interaction.options.getFocused(true);

  if (focused.name === Options.ROLE_SELF_ASSIGN)
    choices = getFilteredChoices(choices, focused.value);

  await interaction.respond(choices);
};
