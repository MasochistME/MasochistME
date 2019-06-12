import Discord from "discord.js";
import { log } from '../../../log';
import { createEmbed  } from '../../helpers';
import { upsertOne } from '../../db';
import { cache } from '../../../cache';

export const follow = (msg:Discord.Message) => {
    let embed:Discord.RichEmbed;
    let content = '';
    let usersToFollow = msg.mentions.users.map(streamer => streamer.id);
    let usersToNotFollow = new Array();

    cache["follow"].map(streamer => {
        if (usersToFollow.includes(streamer.id) && streamer.followers.includes(msg.author.id))
            usersToNotFollow.push(streamer.id);
    })
    usersToFollow = usersToFollow.filter(user => !usersToNotFollow.includes(user));
    
    if (usersToNotFollow.length > 0)
        content += `You already follow ${usersToNotFollow.map(user => msg.guild.members.find(member => member.id === user).user.username).join(', ')}. Why do you even bother?\n`;
    if (usersToFollow.length > 0)
        content += `${msg.author.username} now follows ${usersToFollow.map(user => msg.guild.members.find(member => member.id === user).user.username).join(', ')}! What a waste of time.`;    
    if (msg.mentions.users.map(streamer => streamer.id).length === 0)
        embed = createEmbed('<:boshy:310151885690503169> Incorrect input', [{ title: `---`, content: `You didn't mention users who you want to follow.` }]);
    else {
        embed = createEmbed('Follower alert', [{ title: '---', content }]);
        usersToFollow.map(user => {
            const followers = cache["follow"].find(streamer => streamer.id === user) 
                ? cache["follow"].find(streamer => streamer.id === user).followers.push(msg.author.id)
                : {
                    id: user,
                    followers: [ msg.author.id ]
                } 
            upsertOne('follow', { id: user }, followers, err => {
                embed = createEmbed('<:boshy:310151885690503169> Something went wrong', [{ title: `---`, content: `Something went wrong.` }])
                err && log.WARN(err);
            });
        });
    };
    msg.channel.send(embed);
}
export const unfollow = (msg:Discord.Message) => {
    let embed:Discord.RichEmbed;
    let content = '';
    let usersToUnfollow = new Array();
    let usersToNotUnfollow = msg.mentions.users.map(streamer => streamer.id);

    cache["follow"].map(streamer => {
        if (streamer.followers.includes(msg.author.id))
            usersToUnfollow.push(streamer.id);
    })
    usersToNotUnfollow = usersToNotUnfollow.filter(user => !usersToUnfollow.includes(user));

    if (usersToNotUnfollow.length > 0)
        content += `You don't follow ${usersToNotUnfollow.map(user => msg.guild.members.find(member => member.id === user).user.username).join(', ')}, you fool.\n`;
    if (usersToUnfollow.length > 0)
        content += `${msg.author.username} no longer follows ${usersToUnfollow.map(user => msg.guild.members.find(member => member.id === user).user.username).join(', ')}. It was boring anyway.`;    
    if (msg.mentions.users.map(streamer => streamer.id).length === 0)
        embed = createEmbed('<:boshy:310151885690503169> Incorrect input', [{ title: `---`, content: `You didn't mention users who you want to unfollow.` }]);
    else {
        embed = createEmbed('Unfollower alert', [{ title: '---', content }]);
        usersToUnfollow.map(user => {
            let followers = cache["follow"].find(streamer => streamer.id === user);
            if (followers) {
                followers.followers = followers.followers.filter(follower => follower !== msg.author.id)
                upsertOne('follow', { id: user }, followers, err => {
                    embed = createEmbed('<:boshy:310151885690503169> Something went wrong', [{ title: `---`, content: `Something went wrong.` }])
                    err && log.WARN(err);
                });
            }
        });
    };
    msg.channel.send(embed);
}
export const followers = (msg:Discord.Message) => {
    let followers = cache["follow"].find(user => user.id === msg.author.id);
    let embed:Discord.RichEmbed;
    let content:string = '- ';
    let followingUsers = [];

    if (followers) {
        followingUsers = followers.followers
            .map(follower => {
                const member = msg.guild.members.find(m => m.id === follower);
                if (member && member.user && member.user.username)
                    return member.user.username;
                else
                    return '?';
        });
    }
    
    if (followingUsers.length === 0)
        content = 'No one follows you yet.\n\nYou don\'t even have any friends. So sad.'; 
    else
        content += followingUsers.join('\n- ');
    embed = createEmbed('Users that follow you', [{ title: `---`, content }]);
    msg.channel.send(embed);
}
export const following = (msg:Discord.Message) => {
    let following = cache["follow"]
        .filter(streamer => streamer.followers.includes(msg.author.id))
        .map(streamer => {
            const member = msg.guild.members.find(m => m.id === streamer.id);
            if (member && member.user && member.user.username)
                return member.user.username;
            else
                return '?';
        });
    let embed:Discord.RichEmbed;
    let content:string = '- ';
    
    if (following.length === 0)
        content = 'No one.'; 
    else
        content += following.join('\n- ');
    embed = createEmbed('Users followed by you', [{ title: `---`, content }]);
    msg.channel.send(embed);
}

export const live = (msg:Discord.Message) => {
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