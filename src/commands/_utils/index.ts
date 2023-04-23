import { ApplicationCommandOptionChoiceData } from "discord.js";

/**
 * Filter the choice list based on the user provided autocomplete value.
 * @param choices ApplicationCommandOptionChoiceData[],
 * @param focused string
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getFilteredChoices = (
  choices: ApplicationCommandOptionChoiceData[],
  focused: string,
) => {
  return choices
    .filter(choice =>
      focused.length
        ? choice.name.toLowerCase().includes(focused.toLowerCase())
        : true,
    )
    .slice(0, 24);
};
