import { AutocompleteInteraction } from "discord.js";
import {
  createbadgeAutocomplete,
  editbadgeAutocomplete,
  badgeAutocomplete,
} from "./badgeAutocomplete";

const BADGE_MEMBER_CMDS = ["givebadge", "revokebadge"];
const BADGE_EDIT_CMDS = ["deletebadge", "editbadge"];
const BADGE_CREATION_CMDS = ["createbadge"];

export const handleAutocomplete = (interaction: AutocompleteInteraction) => {
  if (BADGE_CREATION_CMDS.includes(interaction.commandName)) {
    createbadgeAutocomplete(interaction);
  }
  if (BADGE_EDIT_CMDS.includes(interaction.commandName)) {
    editbadgeAutocomplete(interaction);
  }
  if (BADGE_MEMBER_CMDS.includes(interaction.commandName)) {
    badgeAutocomplete(interaction);
  }
};
