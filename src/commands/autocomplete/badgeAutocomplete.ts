import { AutocompleteInteraction } from "discord.js";

import { cache } from "fetus";
import { CacheItem } from "cache";

export const badgeAutocomplete = async (
  interaction: AutocompleteInteraction,
): Promise<void> => {
  if (!interaction.isAutocomplete()) return;

  let choices: CacheItem[] = [];

  const focused = interaction.options.getFocused(true);

  if (focused.name === "badge")
    choices = getChoices(cache.badges, focused.value);
  if (focused.name === "member")
    choices = getChoices(cache.members, focused.value);

  await interaction.respond(
    choices.map(choice => ({ name: choice.name, value: choice.id })),
  );
};

const getChoices = (choices: CacheItem[], focused: string) => {
  return choices
    .filter(choice =>
      focused.length
        ? choice.name.toLowerCase().includes(focused.toLowerCase())
        : true,
    )
    .slice(0, 24);
};
