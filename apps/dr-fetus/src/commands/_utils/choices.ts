import { cache } from "fetus";
import { getFilteredChoices } from "commands/_utils";
import { shortenString } from "utils";
import { Console } from "console";

/**
 * Filter the badge choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getBadgeChoices = (focused: string) => {
  const choices = cache.badges.map(badge => {
    const game = cache.games.find(g => g.id === badge.gameId);
    const nameFull = `${(game?.name ?? "UNKNOWN GAME").toUpperCase()} - ${
      badge.name
    } (${badge.description})`;
    const name = shortenString(nameFull, 100);
    return {
      name,
      value: String(badge._id),
    };
  });

  return getFilteredChoices(choices, focused);
};

/**
 * Filter the game choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getGameChoices = (focused: string) => {
  const choices = cache.games.map(game => {
    const name = shortenString(game.name, 100);
    return {
      name,
      value: String(game.id),
    };
  });

  return getFilteredChoices(choices, focused);
};

/**
 * Filter the member choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getMemberChoices = (focused: string) => {
  const choices = cache.members.map(member => {
    const name = shortenString(member.name, 100);
    return {
      name,
      value: String(member.id),
    };
  });

  return getFilteredChoices(choices, focused);
};

/**
 * Filter the race choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @return ApplicationCommandOptionChoiceData[]
 */
export const getRaceChoices = (focused: string) => {
  const choices = cache.races.map(race => {
    const name = shortenString(race.name, 100);
    return {
      name,
      value: String(race._id),
    };
  });

  return getFilteredChoices(choices, focused);
};
