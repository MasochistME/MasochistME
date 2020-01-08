import '@babel/polyfill';
import Discord from 'discord.js';
import { log } from './log';
import { classifyMessage } from './lib/message';
import { handleStream } from './lib/stream';
import { msgEdit, msgDelete, userJoin, userLeave } from './lib/events';
import { connectToDb } from './lib/db';
import { cache } from './cache';

import config from './config.json';

const bot = new Discord.Client();

const ready = () => {
    config.DATABASES.map(db => connectToDb(db));
    init(bot);
}

const init = bot => {
    bot.on('message', classifyMessage);
    bot.on('presenceUpdate', handleStream);
    bot.on('messageUpdate', msgEdit);
    bot.on('messageDelete', msgDelete);
    bot.on('guildMemberAdd', userJoin);
    bot.on('guildMemberRemove', userLeave);

    cache.bot = bot;
    log.INFO(`${new Date().toLocaleString()} - Dr. Fetus reporting for destruction!`);        
}

bot.login(config.DISCORD_TOKEN);
bot.on('ready', ready);

