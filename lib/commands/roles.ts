import Discord from 'discord.js';

export const userHasRoleId = (member:Discord.GuildMember, roleId:string) => member.roles.some(role => role.id === roleId);
export const userHasRoleName = (member:Discord.GuildMember, roleName:string) => member.roles.some(role => role.name === roleName);