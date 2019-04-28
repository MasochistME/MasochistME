import '@babel/polyfill';
import Discord from 'discord.js';
import fs from 'fs';
import { log } from './log';
import { classifyMessage } from './lib/message';
import { cache } from './cache';

import config from './config.json';

const bot = new Discord.Client();

const ready = bot => {
    const path = `${__dirname}/data/local`;
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
    cache.bot = bot;
    log.INFO('Great Herald started working!');
}

bot.on('ready', () => ready(bot));
bot.on('message', classifyMessage);

bot.login(config.DISCORD_TOKEN);