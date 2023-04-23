import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";
// @ts-ignore:next-line
import { getFilteredChoices } from "commands/_utils";

/**
 * Handles autocompletion for the "template" command.
 * @param interaction
 * @return void
 */
export const templateAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [
    { name: "option 1", value: "option1" },
    { name: "option 2", value: "option2" },
  ];
  const focused = interaction.options.getFocused(true);

  if (focused.name === "stringoption")
    choices = getFilteredChoices(choices, focused.value);

  await interaction.respond(choices);
};
