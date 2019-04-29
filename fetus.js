import '@babel/polyfill';
import Discord from 'discord.js';
import { log } from './log';
import { classifyMessage } from './lib/message';
import { connectToDb, updateCache } from './lib/db';
import { cache } from './cache';

import config from './config.json';

const bot = new Discord.Client();

const ready = bot => {
    connectToDb();
    const interval = 900000;
    const updateInterval = setInterval(updateCache, interval);

    cache.bot = bot;
    log.INFO('Dr. Fetus reporting for destruction!');
}

bot.on('ready', () => ready(bot));
bot.on('message', classifyMessage);

bot.login(config.DISCORD_TOKEN);