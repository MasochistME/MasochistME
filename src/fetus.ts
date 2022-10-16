import * as dotenv from "dotenv";
import axios from "axios";
import { Arcybot } from "arcybot";

import { getOption, Database } from "utils";
import { Cache } from "cache";

import { commandsFunctions, customCommands } from "commands";
import { handleAutocomplete, handleButtons } from "interactions";

dotenv.config();

/************************
 *       DB CONFIG      *
 ************************/

const botDb = process.env["ENV"] === "dev" ? "fetus-dev" : "fetus";
const dbConfig = [
  { symbol: botDb, url: process.env["DB"] },
  { symbol: "masochist", url: process.env["DB"] },
];

export const mongo = new Database(dbConfig);

/************************
 *         CACHE        *
 ************************/

const cacheConfig = { botDb };
export const cache = new Cache(cacheConfig);

/************************
 *      BOT CONFIG      *
 ************************/

export let bot: Arcybot;

const init = async () => {
  await mongo.init();
  await cache.update();

  const config = {
    discordToken: process.env.DISCORD_TOKEN,
    botId: process.env.BOT_ID,
    modRole: getOption("modRole"),
    guildId: getOption("guildId"),
  };

  bot = new Arcybot(
    config,
    cache.commandList,
    commandsFunctions,
    // @ts-ignore
    customCommands,
  );

  bot.start("Dr. Fetus reporting for destruction!");

  bot.botClient.on("interactionCreate", async interaction => {
    if (interaction.isAutocomplete()) handleAutocomplete(interaction);
    if (interaction.isButton()) handleButtons(interaction);
  });
};

init();

// const init = bot => {
//   bot.on("message", classifyMessage);
//   bot.on("messageUpdate", msgEdit);
//   bot.on("messageDelete", msgDelete);
//   bot.on("guildMemberAdd", userJoin);
//   bot.on("guildMemberRemove", userLeave);

//   cache.bot = bot;
//   log.INFO(
//     `${new Date().toLocaleString()} - Dr. Fetus reporting for destruction!`,
//   );
// };

if (process.env.ACCESS_TOKEN)
  axios.defaults.headers.common["Authorization"] = process.env.ACCESS_TOKEN;
