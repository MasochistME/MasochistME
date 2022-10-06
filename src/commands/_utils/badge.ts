import { cache } from "fetus";
import { getFilteredChoices } from "commands/_utils";

/**
 * Filter the badge choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @returns ApplicationCommandOptionChoiceData[]
 */
export const getBadgeChoices = (focused: string) => {
  const choices = cache.badges.map(badge => {
    const game = cache.games.find(g => g.id === badge.gameId);
    return {
      name: `${(game?.name ?? "UNKNOWN GAME").toUpperCase()} - ${badge.name} (${
        badge.description
      })`,
      value: badge.id,
    };
  });

  return getFilteredChoices(choices, focused);
};

/**
 * Filter the game choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @returns ApplicationCommandOptionChoiceData[]
 */
export const getGameChoices = (focused: string) => {
  const choices = cache.games.map(game => ({
    name: game.name,
    value: game.id,
  }));

  return getFilteredChoices(choices, focused);
};

/**
 * Filter the member choice list based on the user provided autocomplete value.
 * @param focused string - user provided autocomplete value
 * @returns ApplicationCommandOptionChoiceData[]
 */
export const getMemberChoices = (focused: string) => {
  const choices = cache.members.map(member => ({
    name: member.name,
    value: member.id,
  }));

  return getFilteredChoices(choices, focused);
};
