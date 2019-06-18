import Discord from 'discord.js';
import _ from 'lodash';
import { insertMany } from '../../db';
import { createEmbed } from '../../helpers';
import { cache } from '../../../cache';
import { log } from '../../../log';

const fields:Array<string> = [ 'game id', 'name', 'image', 'points', 'requirements', 'description'];

const badgeScreenEmbed = () => {
    let content = '';
    fields.map(field => {
        const fieldNoSpaces = field.replace(' ', '');
        content += cache["addbadge"].badge[fieldNoSpaces] 
            ? `✅ ${field} - ${ cache["addbadge"].badge[fieldNoSpaces] }\n` 
            : cache["addbadge"].activeField === fieldNoSpaces 
                ? `➡ ${field}\n`
                : `⏳ ${field}\n`
    });
    return createEmbed('Badge adding screen', [
        { 
            title: '\_\_\_', 
            content
        },
        { 
            title: 'Instruction', 
            content: 'Field indicated by ️️️➡️ is the one you are filling now.\n When you\'re done, react with ✅ emote.\nTo cancel, click ❌.'
        }
    ]);
}

export const badgeCreation = (msg:Discord.Message) => {
    if (!cache["addbadge"].inProgress || !msg.author.id === cache["addbadge"].author || !msg.channel.id === cache["addbadge"].channel) {
        return;
    }
    const activeField = cache["addbadge"].activeField;
    const nextFieldIndex = fields.findIndex(field => field.replace(' ', '') === activeField) + 1;

    cache["addbadge"].badge[activeField] = msg.content.trim(); //add some validation

    if (nextFieldIndex < fields.length)
        cache["addbadge"].activeField = fields[nextFieldIndex].replace(' ', '');
    else 
        cache["addbadge"].activeField = '';
    
    msg.channel.fetchMessage(cache["addbadge"].msgId)
        .then(message => message.edit(badgeScreenEmbed()))
}

export const addbadge = (msg:Discord.Message) => {
    cache["addbadge"].inProgress = true;
    cache["addbadge"].activeField = fields[0].replace(' ', '');

    const embed = badgeScreenEmbed();

    msg.channel.send(embed)
        .then(sentEmbed => {
            const reactions = [ '✅', '❌' ];
            const iterateReactions = (index:number) => {
                if (index >= reactions.length)
                    return;
                // @ts-ignore:next-line
                sentEmbed.react(reactions[index]);
                setTimeout(() => iterateReactions(index + 1), 500);
            }
            iterateReactions(0);
            // @ts-ignore:next-line
            cache["addbadge"].msgId = sentEmbed.id;
            cache["addbadge"].authorId = msg.author.id;
            cache["addbadge"].channelId = msg.channel.id;
        })
        .catch(err => log.WARN(err));

    // insertMany('badges', 'list', [{ 
    //     id: badgeId,
    //     name: badgeName,
    //     img: badgeImg,
    //     points,
    //     requirements,
    //     description,
    //     gameId,
    //     enabled: true,
    //     legacy: false,
    //     }], (err, result) => 
    //         err
    //             ? msg.react('❌')
    //             : msg.react('✅')
    // )
}
