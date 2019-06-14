import Discord from 'discord.js';
import { MongoClient } from 'mongodb';

export const collections = [ 'commands', 'options', 'reactions', 'memes', 'special', 'follow' ];

type IBotCache = {
    db?: MongoClient,
    bot?: Discord.Client,
    commands?: Array<any>,
    options?: Array<any>,
    reactions?: Array<any>,
    memes?: Array<string>,
    special?: Array<any>
    follow?: undefined,
}

let botCache:IBotCache = {
    db: undefined,
    bot: undefined,
    commands: undefined,
    reactions: undefined,
    options: undefined,
    memes: undefined,
    special: undefined,
    follow: undefined,
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