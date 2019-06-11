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

const informFollowers = (member:Discord.GuildMember) => {
    // let followers = cache["follow"]
    //     .filter(follower => follower.list.includes(member.id))
    //     .map(follower => {
    //         const member = member.guild.members.find(m => m.id === follower.id);
    //         if (member && member.user && member.user.username)
    //             return member.user.username;
    //         else
    //             return '?';
    //     });
    // let embed:Discord.RichEmbed;
    // let content:string = '- ';
    
    // if (followers.length === 0)
    //     content = 'No one follows you yet.\n\nYou don\'t even have any friends. So sad.'; 
    // const room_stream = cache["options"].find(option => option.option === 'room_stream')
    //     ? cache["options"].find(option => option.option === 'room_stream').value
    //     : null;
    // const channel = cache["bot"].channels.get(room_stream);
    // if (channel && followers) {
    //     channel.send(embed)
    //         .catch(err => log.WARN(`Something went wrong. ${ err }`))
    //     channel.send()
    // }
}

export const handleStream = (oldMember:Discord.GuildMember, newMember:Discord.GuildMember) => {
    const game = newMember.presence.game;

    if (game && game.url)
        addStreamRole(newMember);
	if (!game || (game && !game.url))
        removeStreamRole(newMember);
}