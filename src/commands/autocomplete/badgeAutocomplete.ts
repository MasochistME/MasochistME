import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { cache } from "fetus";

export const badgeAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];

  const focused = interaction.options.getFocused(true);

  if (focused.name === "badge") choices = getBadgeChoices(focused.value);
  if (focused.name === "member") choices = getMemberChoices(focused.value);

  await interaction.respond(choices);
};

const getBadgeChoices = (focused: string) => {
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

const getMemberChoices = (focused: string) => {
  const choices = cache.members.map(member => ({
    name: member.name,
    value: member.id,
  }));

  return getFilteredChoices(choices, focused);
};

/***************************
 *          UTILS          *
 ***************************/

const getFilteredChoices = (
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
