import {
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from "discord.js";

import { cache } from "fetus";

/**
 * Handles autocompletion for the createbadge command
 * @param interaction
 * @returns void
 */
export const createbadgeAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);
  if (focused.name === "game") choices = getGameChoices(focused.value);

  await interaction.respond(choices);
};

/**
 * Handles autocompletion for the badge edit commands
 * @param interaction
 * @returns void
 */
export const editbadgeAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: ApplicationCommandOptionChoiceData[] = [];
  const focused = interaction.options.getFocused(true);
  if (focused.name === "badge") choices = getBadgeChoices(focused.value);

  await interaction.respond(choices);
};

/**
 * Handles autocompletion for the badge-user interaction commands
 * @param interaction
 * @returns void
 */
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

/***************************
 *          UTILS          *
 ***************************/

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

const getGameChoices = (focused: string) => {
  const choices = cache.games.map(game => ({
    name: game.name,
    value: game.id,
  }));

  return getFilteredChoices(choices, focused);
};

const getMemberChoices = (focused: string) => {
  const choices = cache.members.map(member => ({
    name: member.name,
    value: member.id,
  }));

  return getFilteredChoices(choices, focused);
};

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
