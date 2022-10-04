import * as dotenv from "dotenv";
import axios from "axios";
import { Arcybot } from "arcybot";

import { Database } from "utils/db";
import {
  commandsFunctions,
  customCommands,
  handleAutocomplete,
} from "commands";
import { Cache } from "cache";

dotenv.config();

/************************
 *       DB CONFIG      *
 ************************/

const dbConfig = [
  { symbol: "fetus", url: process.env["DB_FETUS"] },
  { symbol: "masochist", url: process.env["DB_MASOCHIST"] },
];

export const mongo = new Database(dbConfig);

/************************
 *         CACHE        *
 ************************/

export const cache = new Cache();

/************************
 *      BOT CONFIG      *
 ************************/

const config = {
  discordToken: process.env.DISCORD_TOKEN,
  botId: process.env.BOT_ID,
};

const init = async () => {
  await mongo.init();
  await cache.update();

  const bot = new Arcybot(
    config,
    cache.commandList,
    commandsFunctions,
    // @ts-ignore
    customCommands,
  );

  bot.start("Dr. Fetus reporting for destruction!");

  bot.botClient.on("interactionCreate", async interaction => {
    if (interaction.isAutocomplete()) {
      handleAutocomplete(interaction);
    }
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

axios.defaults.headers.common["Authorization"] = process.env.ACCESS_TOKEN;
