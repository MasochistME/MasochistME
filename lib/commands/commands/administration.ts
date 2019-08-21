import Discord from 'discord.js';
import _ from 'lodash';
import { log } from '../../../log';
import { removeKeyword, extractArguments, createEmbed } from '../../helpers';
import { cache } from '../../../cache';
import { updateCache } from '../../db';
import config from '../../../config.json';

// @ts-ignore
export const status = (msg:Discord.Message) => cache.bot.user.setPresence({ game: { name: removeKeyword(msg), type: 0}})

export const impersonate = (msg:Discord.Message) => {
    const messageAndGuild = extractArguments(msg);
    if (messageAndGuild.length !== 2) {
        msg.channel.send('This command requires exactly two arguments: ``message|channel_id``.');
        return;
    }
    // @ts-ignore
    const channel = cache.bot.channels.get(messageAndGuild[1]);
    if (!channel) {
        msg.channel.send(`I don't have access to this channel, you dumbass.`);
        return;
    }
    channel.send(messageAndGuild[0])
        .catch(e => {
            msg.channel.send(`Something fucked up.`)
            log.WARN(e);
        });
}

export const options = (msg:Discord.Message) => {
    let options = cache["options"].map(option => {
        return {
            title: option.option,
            content: option.option.startsWith('room_') ? `<#${option.value}>` : option.value,
            inline: true
        }
    })
    options = _.orderBy(options, ['title'], ['asc']);
    const embed = createEmbed('⚙️ Dr. Fetus settings', options);
    msg.channel.send(embed);
}

export const updatecache = () => {
    config.DATABASES.map(db => updateCache(db.symbol));
}