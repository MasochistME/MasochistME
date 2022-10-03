import { AutocompleteInteraction } from "discord.js";
import { badgeAutocomplete } from "./badgeAutocomplete";

const BADGE_CMDS = ["givebadge", "revokebadge"];

export const handleAutocomplete = (interaction: AutocompleteInteraction) => {
  if (BADGE_CMDS.includes(interaction.commandName)) {
    badgeAutocomplete(interaction);
  }
};
