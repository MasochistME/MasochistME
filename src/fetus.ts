import Discord from "discord.js";
import { log } from "utils/log";
import { classifyMessage } from "message";
import { handleStream } from "utils/stream";
import { msgEdit, msgDelete, userJoin, userLeave } from "utils/events";
import { connectToDb } from "utils/db";
import { cache } from "utils/cache";

import config from "../config.json";

const bot = new Discord.Client();

const ready = () => {
  config.DATABASES.map(db => connectToDb(db));
  init(bot);
};

const init = bot => {
  bot.on("message", classifyMessage);
  bot.on("presenceUpdate", handleStream);
  bot.on("messageUpdate", msgEdit);
  bot.on("messageDelete", msgDelete);
  bot.on("guildMemberAdd", userJoin);
  bot.on("guildMemberRemove", userLeave);

  cache.bot = bot;
  log.INFO(
    `${new Date().toLocaleString()} - Dr. Fetus reporting for destruction!`,
  );
};

bot.login(config.DISCORD_TOKEN);
bot.on("ready", ready);
