import Discord from 'discord.js';

type IBotCache = {
    bot?: Discord.Client;
}

let botCache:IBotCache = {};

class BotCache {
    constructor() {
        if (botCache)
            return botCache;
        botCache = this;

        botCache.bot = undefined;

        return botCache;
    }
}

export let cache = new BotCache();