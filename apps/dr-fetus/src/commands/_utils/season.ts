import { cache } from "fetus";
import { getFilteredChoices } from "commands/_utils";

const NO_SEASON = { name: "None", value: "None" };
/**
 * Filter the list of inactive seasons based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getSeasonInactiveChoices = (focused: string) => {
  const choices = cache.seasons
    .filter(season => !season.startDate)
    .map(season => {
      return {
        name: season.name.toUpperCase(),
        value: String(season._id),
      };
    });
  const allChoices = [...choices, NO_SEASON];

  return getFilteredChoices(allChoices, focused);
};

/**
 * Filter the list of active seasons based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getSeasonActiveChoices = (focused: string) => {
  const choices = cache.seasons
    .filter(season => season.startDate && !season.endDate)
    .map(season => {
      return {
        name: season.name.toUpperCase(),
        value: String(season._id),
      };
    });
  const allChoices = [...choices, NO_SEASON];

  return getFilteredChoices(allChoices, focused);
};
