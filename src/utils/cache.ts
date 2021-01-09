import Discord from "discord.js";

type IBotCache = {
  bot?: Discord.Client;
  dbs?: any;
  addbadge?: {
    inProgress: boolean;
    msgId: string;
    authorId: string;
    channelId: string;
    activeField: string;
    badge: any;
  };
};

let botCache: IBotCache = {
  bot: undefined,
  dbs: {},
  addbadge: {
    inProgress: false,
    msgId: "",
    authorId: "",
    channelId: "",
    activeField: "",
    badge: {},
  },
};

class BotCache {
  [x: string]: any;
  constructor() {
    if (botCache) {
      return botCache;
    }
    botCache = this;

    return botCache;
  }
}

export const cache: any = new BotCache();
