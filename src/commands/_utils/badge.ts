import { ApplicationCommandOptionChoiceData } from "discord.js";

import { cache } from "fetus";

/***************************
 *          UTILS          *
 ***************************/

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

export const getGameChoices = (focused: string) => {
  const choices = cache.games.map(game => ({
    name: game.name,
    value: game.id,
  }));

  return getFilteredChoices(choices, focused);
};

export const getMemberChoices = (focused: string) => {
  const choices = cache.members.map(member => ({
    name: member.name,
    value: member.id,
  }));

  return getFilteredChoices(choices, focused);
};

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
