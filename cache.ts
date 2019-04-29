import Discord from 'discord.js';
import { MongoClient } from 'mongodb';

type IBotCache = {
    db?:MongoClient;
    bot?: Discord.Client;
    memes?: Array<string>;
    members?:Array<any>;
    games?:Array<any>;
}

let botCache:IBotCache = {
    db:undefined,
    bot:undefined,
    memes:undefined,
    members:undefined,
    games:undefined,
};

class BotCache {
    constructor() {
        if (botCache)
            return botCache;
        botCache = this;

        return botCache;
    }
}

export let cache = new BotCache();