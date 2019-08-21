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

const ready = bot => {
    config.DATABASES.map(db => connectToDb(db));

    cache.bot = bot;
    log.INFO('Dr. Fetus reporting for destruction!');
}

bot.on('ready', () => ready(bot));
bot.on('message', classifyMessage);
bot.on('presenceUpdate', handleStream)
bot.on('messageUpdate', msgEdit)
bot.on('messageDelete', msgDelete)
bot.on('guildMemberAdd', userJoin)
bot.on('guildMemberRemove', userLeave)

bot.login(config.DISCORD_TOKEN);