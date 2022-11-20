import { AutocompleteInteraction } from "discord.js";

import { badgeCreateAutocomplete } from "commands/badgecreate/interactions";
import { badgeEditAutocomplete } from "commands/badgeedit/interactions";
import { vidGameAutocomplete } from "commands/vid/interactions";

import { badgeAutocomplete } from "commands/_interactions/badge";
import {
  seasonInactiveAutocomplete,
  seasonActiveAutocomplete,
} from "commands/_interactions/season";

const BADGE_MEMBER_CMDS = ["badgegive", "badgerevoke"];
const BADGE_EDIT_CMDS = ["badgedelete", "badgeedit"];
const BADGE_CREATION_CMDS = ["badgecreate"];
const SEASON_START = ["seasonstart"];
const GET_ACTIVE_SEASONS = ["racesetup", "seasonend"];
const VID_GET_GANE = ["vid"];

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
  if (SEASON_START.includes(interaction.commandName)) {
    seasonInactiveAutocomplete(interaction);
  }
  if (GET_ACTIVE_SEASONS.includes(interaction.commandName)) {
    seasonActiveAutocomplete(interaction);
  }
  if (VID_GET_GANE.includes(interaction.commandName)) {
    vidGameAutocomplete(interaction);
  }
};
