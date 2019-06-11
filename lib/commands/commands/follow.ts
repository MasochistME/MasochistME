import Discord from "discord.js";
import { log } from '../../../log';
import { createEmbed  } from '../../helpers';
import { upsertOne } from '../../db';
import { cache } from '../../../cache';

export const follow = (msg:Discord.Message) => { // change this so list is people following X, not who X follows!!!
    let following = cache["follow"].find(user => user.id === msg.author.id);
    const usersAlreadyFollowed = following ? following.list : [];
    const usersToFollow = msg.mentions.users
        .filter(user => !usersAlreadyFollowed.includes(user.id))
        .map(user => {
            return {
                id: user.id,
                username: user.username
            }})
    const usersToNotFollow = msg.mentions.users
        .filter(user => usersAlreadyFollowed.includes(user.id))
        .map(user => {
            return {
                id: user.id,
                username: user.username
            }})
    let content:string = '';
    let embed:Discord.RichEmbed;
    
    if (usersToNotFollow.length > 0)
        content += `You already follow ${usersToNotFollow.map(user => user.username).join(', ')}. Why do you even bother?\n`;
    if (usersToFollow.length > 0)
        content += `${msg.author.username} now follows ${usersToFollow.map(user => user.username).join(', ')}! What a waste of time.`;
    if (msg.mentions.users.map(u => u.id).length === 0)
        embed = createEmbed('<:boshy:310151885690503169> Incorrect input', [{ title: `---`, content: `You didn't mention the person who you want to follow.` }]);
    else {
        embed = createEmbed('Follower alert', [{ title: '---', content }]);
        if (!following)
            following = { id: msg.author.id, list: usersToFollow.map(user => user.id) };
        else following.list.push(...usersToFollow.map(user => user.id));
        upsertOne('follow', { id: msg.author.id }, following, err => {
            embed = createEmbed('<:boshy:310151885690503169> Something went wrong', [{ title: `---`, content: `Something went wrong.` }])
            err && log.WARN(err)
        });
    }
    msg.channel.send(embed);
}
export const unfollow = (msg:Discord.Message) => {
    let following = cache["follow"].find(user => user.id === msg.author.id);
    const usersAlreadyFollowed = following ? following.list : [];
    const usersToUnfollow = msg.mentions.users
        .filter(user => usersAlreadyFollowed.includes(user.id))
        .map(user => {
            return {
                id: user.id,
                username: user.username
            }})
    const usersToNotUnfollow = msg.mentions.users
        .filter(user => !usersAlreadyFollowed.includes(user.id))
        .map(user => {
            return {
                id: user.id,
                username: user.username
            }})
    const newFollowersList = usersAlreadyFollowed
        .filter(user => !usersToUnfollow.some(unfollow => unfollow.id === user));    
    let content:string = '';
    let embed:Discord.RichEmbed;
    
    if (usersToNotUnfollow.length > 0)
        content += `You don't follow ${usersToNotUnfollow.map(user => user.username).join(', ')}, you fool.\n`;
    if (usersToUnfollow.length > 0)
        content += `${msg.author.username} no longer follows ${usersToUnfollow.map(user => user.username).join(', ')}! It was boring anyway.`;
    if (msg.mentions.users.map(u => u.id).length === 0)
        embed = createEmbed('<:boshy:310151885690503169> Incorrect input', [{ title: `---`, content: `You didn't mention the person who you want to follow.` }]);
    else {
        embed = createEmbed('Unfollower alert', [{ title: '---', content }]);
        if (!following)
            following = { id: msg.author.id, list: newFollowersList };
        else following.list = newFollowersList;
        upsertOne('follow', { id: msg.author.id }, following, err => {
            embed = createEmbed('<:boshy:310151885690503169> Something went wrong', [{ title: `---`, content: `Something went wrong.` }])
            err && log.WARN(err)
        });
    }
    msg.channel.send(embed);
}
export const followers = (msg:Discord.Message) => {
    let followers = cache["follow"]
        .filter(follower => follower.list.includes(msg.author.id))
        .map(follower => {
            const member = msg.guild.members.find(m => m.id === follower.id);
            if (member && member.user && member.user.username)
                return member.user.username;
            else
                return '?';
        });
    let embed:Discord.RichEmbed;
    let content:string = '- ';
    
    if (followers.length === 0)
        content = 'No one follows you yet.\n\nYou don\'t even have any friends. So sad.'; 
    else
        content += followers.join('\n- ');
    embed = createEmbed('Users that follow you', [{ title: `---`, content }]);
    msg.channel.send(embed);
}
export const following = (msg:Discord.Message) => {
    let following = cache["follow"].find(user => user.id === msg.author.id);
    const followedUsers = following.list
        .map(user => {
            const member = msg.guild.members.find(m => m.id === user);
            if (member && member.user && member.user.username)
                return member.user.username;
            else
                return '?';
        });
    let embed:Discord.RichEmbed;
    let content:string = '- ';
    
    if (followedUsers.length === 0)
        content = 'No one.'; 
    else
        content += followedUsers.join('\n- ');
    embed = createEmbed('Users you follow', [{ title: `---`, content }]);
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