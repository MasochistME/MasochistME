import { AutocompleteInteraction } from "discord.js";
import {
  createbadgeAutocomplete,
  deletebadgeAutocomplete,
  badgeAutocomplete,
} from "./badgeAutocomplete";

const BADGE_MEMBER_CMDS = ["givebadge", "revokebadge"];
const BADGE_REMOVAL_CMDS = ["deletebadge"];
const BADGE_CREATION_CMDS = ["createbadge"];

export const handleAutocomplete = (interaction: AutocompleteInteraction) => {
  if (BADGE_CREATION_CMDS.includes(interaction.commandName)) {
    createbadgeAutocomplete(interaction);
  }
  if (BADGE_REMOVAL_CMDS.includes(interaction.commandName)) {
    deletebadgeAutocomplete(interaction);
  }
  deletebadgeAutocomplete;
  if (BADGE_MEMBER_CMDS.includes(interaction.commandName)) {
    badgeAutocomplete(interaction);
  }
};
