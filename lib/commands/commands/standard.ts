import Discord from "discord.js";
import { chooseRandom } from '../../rng';
import { removeKeyword, createEmbed } from '../../helpers';
import { insertData } from '../../db';
import { cache } from '../../../cache';

// @ts-ignore
export const help = (msg:Discord.Message) => {
    let content = '';
    let embed;
    cache["commands"]
        .filter(cmd => !cmd.isModOnly && cmd.description)
        .map(cmd => content += `- \`\`${cmd.keyword}\`\` - ${cmd.description}\n`);
    embed = createEmbed('📜 Standard commands', [{ title: 'List:', content }]);
    msg.channel.send(embed);
}
export const hmod = (msg:Discord.Message) => {
    let content = '';
    let embed;
    cache["commands"]
        .filter(cmd => cmd.isModOnly && cmd.description)
        .map(cmd => content += `- \`\`${cmd.keyword}\`\` - ${cmd.description}\n`);
    embed = createEmbed('📜 Moderation commands', [{ title: 'List:', content }]);
    msg.channel.send(embed);
}
export const meme = (msg:Discord.Message) => msg.channel.send(`_"${chooseRandom(cache["memes"]).meme}"_`);
export const addmeme = (msg:Discord.Message) => insertData('memes', 'meme', removeKeyword(msg), err => 
    err
        ? msg.react('❌')
        : msg.react('✅'));