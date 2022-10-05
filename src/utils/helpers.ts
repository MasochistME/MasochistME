import { DiscordInteraction } from "arcybot";
import { ButtonInteraction, GuildMemberRoleManager, Role } from "discord.js";

import { getOption } from "utils";

export const isLink = (supposedLink: string): boolean =>
  supposedLink.startsWith("http");

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
