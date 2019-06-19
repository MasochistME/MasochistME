import Discord from 'discord.js';
import _ from 'lodash';
import { insertMany } from '../../db';
import { createEmbed } from '../../helpers';
import { cache } from '../../../cache';
import { log } from '../../../log';

const timeout = 6000;
const fields:Array<string> = [ 'game id', 'name', 'image', 'points', 'requirements', 'description'];

const badgeScreenEmbed = (active:boolean) => {
    let content = '';
    fields.map(field => {
        const fieldNoSpaces = field.replace(' ', '');
        content += cache["addbadge"].badge[fieldNoSpaces] 
            ? `✅ ${field} - ${ cache["addbadge"].badge[fieldNoSpaces] }\n` 
            : cache["addbadge"].activeField === fieldNoSpaces 
                ? `➡ ${field}\n`
                : `🔲 ${field}\n`
    });
    return createEmbed('Badge adding screen', [
        { 
            title: '\_\_\_', 
            content
        },
        { 
            title: 'Instruction', 
            content: `Field indicated by ️️️➡️ is the one you are filling now.
                \n✅ to save, ❌ to cancel.`
        }
    ],
    '0xFDC000',
    cache["addbadge"].badge.image ? cache["addbadge"].badge.image : 'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/question.png',
    active
        ? `Unfinished badge expires at ${ new Date(Date.now() + timeout).toLocaleString()}.`
        : `Badge expired at ${ new Date(Date.now()).toLocaleString()}.`
    );
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
        .then(message => message.edit(badgeScreenEmbed(true)))
}

export const addbadge = (msg:Discord.Message) => {
    cache["addbadge"].inProgress = true;
    cache["addbadge"].activeField = fields[0].replace(' ', '');

    const embed = badgeScreenEmbed(true);

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
            const filter = (reaction, user) => user.id === cache["addbadge"].authorId && (reaction.emoji.name === '❌' || reaction.emoji.name === '✅');
            // @ts-ignore:next-line
            sentEmbed.awaitReactions(filter, {
                time: timeout,
                maxEmojis: 1
            }).then(collected => finalizeBadge(collected))
            .catch(e => console.log(e))
        })
        .catch(err => log.WARN(err));
}

export const finalizeBadge = (collected:any) => {
    collected = collected.map(col => {
        return {
            name: col.emoji.name,
            message: col.message
        }
    })[0];
    if (!collected) {
        expireBadge();
        return;
    }
    if (collected.name === '❌') {
        const embed = createEmbed('❌ Badge cancelled', [{ title: '\_\_\_', content: 'Good, it sucked anyway.' }]);
        collected.message.channel.send(embed);
        clearBadge();
        return;
    }
    if (collected.name === '✅') {
        insertMany('badges', 'list', [{ 
            id: 'dupa',
            name: cache["addbadge"].badge.name,
            img: cache["addbadge"].badge.image,
            points: cache["addbadge"].badge.points,
            requirements: cache["addbadge"].badge.requirements,
            description: cache["addbadge"].badge.description,
            gameId: cache["addbadge"].badge.gameid,
            enabled: true,
            legacy: false,
            }], (err, result) => {
                if (err)
                    return collected.message.channel.send(createEmbed('❌ Error saving badge', [{ title: '\_\_\_', content: err }]))
                collected.message.channel.send(createEmbed('✅ Badge added', [{ title: '\_\_\_', content: 'Done, fucker.' }]));
                clearBadge();
            }
        )
    }
}

const clearBadge = () => cache["addbadge"] = { 
    inProgress: false,
    msgId: '',
    authorId: '',
    channelId: '',
    activeField: '',
    badge: {}
}

const expireBadge = () => {
    const badgeRoom = cache["addbadge"].channelId;
    const channel = cache["bot"].channels.get(badgeRoom);
    channel.fetchMessage(cache["addbadge"].msgId)
        .then(message => {
            message.edit(badgeScreenEmbed(false));
            message.clearReactions()
                .then()
                .catch();
        })
    clearBadge();
}