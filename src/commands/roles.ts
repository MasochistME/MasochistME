import Discord from "discord.js";

export const userHasRoleId = (
  member: Discord.GuildMember,
  roleId: string,
): boolean => member.roles.cache.some(role => role.id === roleId);

export const userHasRoleName = (
  member: Discord.GuildMember,
  roleName: string,
): boolean => member.roles.cache.some(role => role.name === roleName);
