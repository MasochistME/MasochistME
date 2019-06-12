import Discord from "discord.js";
import { log } from '../log';
import { createEmbed } from './helpers';
import { cache } from '../cache';

const sendLog = (embed:Discord.RichEmbed) => {
    const room_log = cache["options"].find(option => option.option === 'room_log')
        ? cache["options"].find(option => option.option === 'room_log').value
        : null;
    const channel = cache["bot"].channels.get(room_log);
    if (channel)
        channel.send(embed)
            .catch(err => log.WARN(`Something went wrong. ${ err }`))
}

export const msgEdit = (oldMessage:Discord.Message, newMessage:Discord.Message) => { 
    if (oldMessage.channel.type === 'dm' || oldMessage.author.bot)
        return;
    const log = createEmbed('', [
        { 
            title: 'MESSAGE EDITED', 
            content: `**Author:** ${ oldMessage.author.username }#${ oldMessage.author.discriminator }\n` +
                `**Created at:** ${ new Date(oldMessage.createdTimestamp).toLocaleString() }\n` +
                `**Edited at:** ${ new Date(Date.now()).toLocaleString() }\n` +
                `**Channel:** <#${ oldMessage.channel.id }>`
        },
        {    
            title: 'Old message', 
            content: `\`\`\`${ oldMessage.content }\`\`\``,
            inline: true
        },
        {    
            title: 'New message', 
            content: `\`\`\`${ newMessage.content }\`\`\``,
            inline: true
        }
    ], '83C4F2');
    sendLog(log);
}
export const msgDelete = (message:Discord.Message) => { 
    if (message.channel.type === 'dm' || message.author.bot)
        return;
    const log = createEmbed('', [
        { 
            title: 'MESSAGE DELETED', 
            content: `**Author:** ${ message.author.username }#${ message.author.discriminator }\n` +
                `**Created at:** ${ new Date(message.createdTimestamp).toLocaleString() }\n` +
                `**Deleted at:** ${ new Date(Date.now()).toLocaleString() }\n` +
                `**Channel:** <#${ message.channel.id }>`
        },
        {    
            title: 'Deleted message', 
            content: `\`\`\`${ message.content }\`\`\``,
            inline: true
        }
    ], 'C70000');
    sendLog(log);
}
export const userJoin = (member:Discord.GuildMember) => { 
    const log = createEmbed('', [
        { 
            title: 'USER JOINS', 
            content: `**User:** ${ member.user.username }#${ member.user.discriminator }\n` +
                `**Joins at:** ${ member.joinedAt }`
        }
    ], '51E61C');
    sendLog(log);
}
export const userLeave = (member:Discord.GuildMember) => { 
    const log = createEmbed('', [
        { 
            title: 'USER LEAVES', 
            content: `**User:** ${ member.user.username }#${ member.user.discriminator }\n` +
                `**Leaves at:** ${ new Date(Date.now()).toLocaleString() }`
        }
    ], 'FDC000');
    sendLog(log);
}