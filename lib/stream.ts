import Discord from 'discord.js';
import { cache } from '../cache';
import { userHasRoleId } from './commands/roles';
import { log } from '../log';
import { createEmbed  } from './helpers';

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
    if (role && !userHasRoleId(member, role)) {
        member.addRole(role)
            .catch(err => console.trace(err));
        informFollowers(member);
    }
}
const removeStreamRole = (member:Discord.GuildMember) => {
    const role = streamRoleId(member);
    if (role && userHasRoleId(member, role))
        member.removeRole(role)
            .catch(err => console.trace(err))
}

export const informFollowers = (member:Discord.GuildMember, url?:string) => {
    const followers = cache["follow"].find(streamer => streamer.id === member.id);    
    const room_stream = cache["options"].find(option => option.option === 'room_stream') 
        ? cache["options"].find(option => option.option === 'room_stream').value 
        : null;
    const channel = cache["bot"].channels.get(room_stream);
    let embed:Discord.RichEmbed;

    if (!followers || followers.followers.length == 0) 
        return;
    if (!channel) {
        log.WARN('Room_stream channel is not set up.');
        return;
    }
    embed = createEmbed(`${member.user.username.toUpperCase()} started streaming!`, 
        [{ title: `---`, content: url || member.presence.game.url }]);

    channel.send(embed);
    channel.send(`**Tagging:** ${followers.followers.map(f => `<@${f}>`).join(', ')}`);
}

export const handleStream = (oldMember:Discord.GuildMember, newMember:Discord.GuildMember) => {
    const game = newMember.presence.game;

    if (game && game.url)
        addStreamRole(newMember);
	if (!game || (game && !game.url))
        removeStreamRole(newMember);
}