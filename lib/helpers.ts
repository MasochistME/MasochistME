import Discord from 'discord.js';
import { IEmbedField } from './types/command';

export const getKeyword = (msg:Discord.Message) => {
    const argumentsPresent = msg.content.includes(' ');
    const keyword = argumentsPresent
        ? msg.content.substring(1, msg.content.indexOf(' '))
        : msg.content.substring(1);
    return keyword.toLowerCase();
};

export const removeKeyword = (msg:Discord.Message) => msg.content.substring(msg.content.indexOf(' '));

export const hasSeparator = (msg:Discord.Message) => removeKeyword(msg).includes('|');

export const extractNicknameAndServer = (msg:Discord.Message) => {
    if (!hasSeparator(msg)) {
        msg.channel.send('This command requires the symbol **|** to separate region from nickname.');
        return {};
    }
    const nicknameAndServer = removeKeyword(msg).split('|');
    const nickname = encodeURIComponent(nicknameAndServer[0].trim());
    const server = nicknameAndServer[1].trim();
    return {
        nickname,
        server
    }
}

export const extractArguments = (msg:Discord.Message) => removeKeyword(msg).split('|');

export const createEmbed = (title: string, fields:[ IEmbedField ], color?: string) => {
    const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(color ? `0x${color}` : '0xFDC000')
    fields.map(field => embed.addField(field.title, field.content));
    return embed;
}