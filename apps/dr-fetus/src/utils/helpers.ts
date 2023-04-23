import { DiscordInteraction } from "arcybot";
import { ButtonInteraction, GuildMemberRoleManager, Role } from "discord.js";

import { getOption } from "utils";

/**
 * Checks if the passed string is a link (starts with http).
 * @param supposedLink string
 * @return boolean
 */
export const isLink = (supposedLink: string): boolean =>
  supposedLink.startsWith("http");

/**
 * Checks if the user interacting with command interface has the Mod role.
 * @param interaction DiscordInteraction | ButtonInteraction
 * @return boolean
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
 * @return string
 */
export const cenzor = (text: string) => {
  return Array(text.length).fill("█").join("");
};

/**
 * Shorten the string to given length and add ellipsis if it was too long.
 * @param strFull String to shorten
 * @param maxLength Max length of the string after shortening
 * @returns string
 */
export const shortenString = (strFull: string, maxLength: number) => {
  const str =
    strFull.length >= maxLength
      ? strFull.substring(0, maxLength - 4) + "..."
      : strFull;
  return str;
};

/**
 *
 * @param arr
 * @param chunkSize
 * @returns
 */
export const splitArrayToChunks = <T>(arr: T[], chunkSize: number) => {
  const chunkArr: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk: T[] = arr.slice(i, i + chunkSize);
    chunkArr.push(chunk);
  }
  return chunkArr;
};
