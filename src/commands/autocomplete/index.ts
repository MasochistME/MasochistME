import { AutocompleteInteraction } from "discord.js";
import {
  badgeCreateAutocomplete,
  badgeEditAutocomplete,
  badgeAutocomplete,
} from "./badgeAutocomplete";

const BADGE_MEMBER_CMDS = ["badgegive", "badgerevoke"];
const BADGE_EDIT_CMDS = ["badgedelete", "badgeedit"];
const BADGE_CREATION_CMDS = ["badgecreate"];

export const handleAutocomplete = (interaction: AutocompleteInteraction) => {
  if (BADGE_CREATION_CMDS.includes(interaction.commandName)) {
    badgeCreateAutocomplete(interaction);
  }
  if (BADGE_EDIT_CMDS.includes(interaction.commandName)) {
    badgeEditAutocomplete(interaction);
  }
  if (BADGE_MEMBER_CMDS.includes(interaction.commandName)) {
    badgeAutocomplete(interaction);
  }
};
