import Discord from 'discord.js';
import { MongoClient } from 'mongodb';

export const collections = [ 'commands', 'options', 'memes', 'members', 'games' ];

type IBotCache = {
    db?: MongoClient,
    bot?: Discord.Client,
    commands?: Array<any>,
    options?: Array<any>,
    memes?: Array<string>,
    members?: Array<any>,
    games?: Array<any>,
}

let botCache:IBotCache = {
    db: undefined,
    bot: undefined,
    commands: undefined,
    options: undefined,
    memes: undefined,
    members: undefined,
    games: undefined,
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