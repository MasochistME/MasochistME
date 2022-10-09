import { DiscordInteraction } from "arcybot";
import { ButtonInteraction, GuildMemberRoleManager, Role } from "discord.js";

import { getOption } from "utils";

/**
 * Checks if the passed string is a link (starts with http).
 * @param supposedLink string
 * @returns boolean
 */
export const isLink = (supposedLink: string): boolean =>
  supposedLink.startsWith("http");

/**
 * Checks if the user interacting with command interface has the Mod role.
 * @param interaction DiscordInteraction | ButtonInteraction
 * @returns boolean
 */
export const isMod = (interaction: DiscordInteraction | ButtonInteraction) => {
  const modRole = getOption("modRole");
  if (modRole && interaction.inGuild()) {
    const isMod = (
      interaction?.member.roles as GuildMemberRoleManager
    ).cache.some((role: Role) => role.name === modRole);
    return isMod;
  }
  return true;
};

/**
 * Returns the cenzored version of a string.
 * @param text string
 * @returns string
 */
export const cenzor = (text: string) => {
  return Array(text.length).fill("█").join("");
};
