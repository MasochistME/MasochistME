import Discord from "discord.js";
import { chooseRandom } from '../../rng';
import { removeKeyword, createEmbed, isLink, extractArguments } from '../../helpers';
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
export const vid = (msg:Discord.Message) => {
    const vid = removeKeyword(msg);
    const channel = cache["options"].find(option => option.option === 'room_vid').value;
    if (!isLink(vid)) {
        msg.channel.send('_This_ is not a link.');
        return;
    }
    cache["bot"].channels.get(channel).send(`${vid} - ${msg.author}`);
}
export const rec = (msg:Discord.Message) => {
    const recFetus = [
        'None of you could beat that lol if u change your mind appreciate',
        'Almost as good as Clicker Heroes',
        'Why should you torture yourself with this game when you can do 100 easy ones?',
        'And it\'s not even guaranteed you\'re gonna win this game.',
        'Many friends also say this is a hardcore game :D',
        'This are real chellenge for mans'
    ];

    const rec = extractArguments(msg);
    const channel = cache["options"].find(option => option.option === 'room_rec').value;
    if (rec.length === 0) {
        msg.channel.send('You forgot about something, dumbass.');
        return;
    }
    if (!isLink(rec[0])) {
        msg.channel.send('_This_ is not a link.');
        return;
    }
    const recText = rec[1] ? rec[1] : chooseRandom(recFetus);
    cache["bot"].channels.get(channel).send(`${rec[0]} - _${recText}_ - ${msg.author}`);
}

export const meme = (msg:Discord.Message) => msg.channel.send(`_"${chooseRandom(cache["memes"]).meme}"_`);
export const addmeme = (msg:Discord.Message) => insertData('memes', 'meme', removeKeyword(msg), err => 
    err
        ? msg.react('❌')
        : msg.react('✅'));