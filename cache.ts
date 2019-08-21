import Discord from 'discord.js';

type IBotCache = {
    bot?: Discord.Client,
    dbs?: { },
    addbadge?: { 
        inProgress:boolean,
        msgId:string,
        authorId:string,
        channelId:string,
        activeField:string,
        badge: {}
    },
}

let botCache:IBotCache = {
    bot: undefined,
    dbs: { },
    addbadge: { 
        inProgress: false,
        msgId: '',
        authorId: '',
        channelId: '',
        activeField: '',
        badge: { }
    },
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