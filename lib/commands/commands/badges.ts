import Discord from 'discord.js';
import _ from 'lodash';
import { insertMany } from '../../db';
import { createEmbed, removeKeyword } from '../../helpers';
import { cache } from '../../../cache';
import { log } from '../../../log';

const timeout = 300000;
const fields:Array<string> = [ 'game id', 'name', 'image', 'points', 'requirements', 'description'];

export const editbadge = (msg:Discord.Message) => {
    const badgeId = removeKeyword(msg);
    console.log(cache)
    const badge = cache["badges"].badges.find(b => b.id === badgeId);
    
    if (!badge) {
        msg.channel.send(createEmbed('Invalid badge ID', [{ title: '\_\_\_', content: 'Cannot edit badge that doesn\'t exist.' }]));
        return;
    }
    msg.channel.send('Edited! :3');
    // ***
}

export const deletebadge = (msg:Discord.Message) => {
    const badgeId = removeKeyword(msg);
    const badge = cache["badges"].badges.find(b => b.id === badgeId);
    
    if (!badge) {
        msg.channel.send(createEmbed('Invalid badge ID', [{ title: '\_\_\_', content: 'Cannot delete badge that doesn\'t exist.' }]));
        return;
    }
    msg.channel.send('Deleted! :3');
    // ***
}

export const badgelist = (msg:Discord.Message) => {
    let content = '';

    cache["badges"] = _.orderBy(cache["badges"], ['gameId'], ['asc']);
    cache["badges"].map((badge, index) => {
        let helper = content + `\`\`${badge._id}\`\` - ${ badge.name.toUpperCase() } - ${ badge.description }\n`;
        if (helper.length >= 2000) {
            msg.channel.send(createEmbed('🥇 List of badges', [{ title: '\_\_\_', content: helper }]));
            content = '';
        }
        content += `\`\`${badge._id}\`\` - ${ badge.name.toUpperCase() } - ${ badge.description }\n`;
        if (index === cache["badges"].length - 1)
            msg.channel.send(createEmbed('🥇 List of badges', [{ title: '\_\_\_', content: helper }]));
    })
}

// addbadge stuff
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

const badgeScreenEmbed = (footer?:string) => {
    let content = '';
    fields.map(field => {
        const fieldNoSpaces = field.replace(' ', '');
        content += cache["addbadge"].badge[fieldNoSpaces] 
            ? `✅ ${field} - ${ cache["addbadge"].badge[fieldNoSpaces] }\n` 
            : cache["addbadge"].activeField === fieldNoSpaces 
                ? `➡ ${field}\n`
                : `🔲 ${field}\n`
    });
    return createEmbed('🥇 Badge adding screen', [
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
    footer
        ? footer
        : `Unfinished badge expires at ${ new Date(Date.now() + timeout).toLocaleString()}.`
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
        .then(message => message.edit(badgeScreenEmbed()))
}

export const finalizeBadge = (collected:any) => {
    collected = collected.map(col => {
        return {
            name: col.emoji.name,
            message: col.message
        }
    })[0];
    if (!collected) {
        expireBadge(`Badge expired at ${ new Date(Date.now()).toLocaleString()}.`);
        return;
    }
    if (collected.name === '❌') {
        const embed = createEmbed('❌ Badge cancelled', [{ title: '\_\_\_', content: 'Good, it sucked anyway.' }]);
        collected.message.channel.send(embed);
        expireBadge(`Badge cancelled at ${ new Date(Date.now()).toLocaleString()}.`)
        return;
    }
    if (collected.name === '✅') {
        insertMany('masochist', 'badges', [{ 
            name: cache["addbadge"].badge.name,
            img: cache["addbadge"].badge.image,
            points: cache["addbadge"].badge.points,
            requirements: cache["addbadge"].badge.requirements,
            description: cache["addbadge"].badge.description,
            gameId: cache["addbadge"].badge.gameid,
            enabled: true,
            legacy: false,
            }], (err, result) => {
                if (err) {
                    collected.message.channel.send(createEmbed('❌ Error saving badge', [{ title: '\_\_\_', content: err }]));
                    expireBadge(`Badge cancelled at ${ new Date(Date.now()).toLocaleString()}.`)
                    return;
                }
                collected.message.channel.send(createEmbed('✅ Badge added', [{ title: '\_\_\_', content: 'Done, fucker.' }]));
                expireBadge(`Badge saved at ${ new Date(Date.now()).toLocaleString()}.`)
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

const expireBadge = (footer?:string) => {
    const badgeRoom = cache["addbadge"].channelId;
    const channel = cache["bot"].channels.get(badgeRoom);
    channel.fetchMessage(cache["addbadge"].msgId)
        .then(message => {
            message.edit(badgeScreenEmbed(footer));
            message.clearReactions()
                .then(() => clearBadge())
                .catch(err => log.WARN(err));
        })
}