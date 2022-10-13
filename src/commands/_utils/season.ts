import { cache } from "fetus";
import { getFilteredChoices } from "commands/_utils";

/**
 * Filter the season choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getSeasonChoices = (focused: string) => {
  const choices = cache.seasons.map(season => {
    return {
      name: season.name.toUpperCase(),
      value: String(season._id),
    };
  });

  return getFilteredChoices(choices, focused);
};
