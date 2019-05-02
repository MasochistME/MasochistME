import Discord from 'discord.js';
import { cache } from '../cache';
import { userHasRoleId } from './commands/roles';

const streamRoleId = (member:Discord.GuildMember) => {
    const streamRoleName = cache["options"].find(option => option.option === 'role_stream')
        ? cache["options"].find(option => option.option === 'role_stream').value
        : undefined;
    const streamRoleId = streamRoleName && member.guild.roles.find(role => role.name === streamRoleName)
        ? member.guild.roles.find(role => role.name === streamRoleName).id 
        : undefined;
    return streamRoleId;
}
const addStreamRole = (member:Discord.GuildMember) => {
    const role = streamRoleId(member);
    if (role && !userHasRoleId(member, role))
        member.addRole(role)
            .catch(err => console.trace(err))
}
const removeStreamRole = (member:Discord.GuildMember) => {
    const role = streamRoleId(member);
    if (role && userHasRoleId(member, role))
        member.removeRole(role)
            .catch(err => console.trace(err))
}

export const handleStream = (oldMember:Discord.GuildMember, newMember:Discord.GuildMember) => {
    const game = newMember.presence.game;

    if (game && game.url)
        addStreamRole(newMember);
	if (!game || (game && !game.url))
        removeStreamRole(newMember);
}