import * as dotenv from "dotenv";
import axios from "axios";
import { Arcybot } from "arcybot";

import { Database } from "utils/db";

dotenv.config();

/***********************
 *      DB CONFIG      *
 ***********************/

const dbConfig = [
  { symbol: "fetus", url: process.env["DB_FETUS"] },
  { symbol: "masochist", url: process.env["DB_MASOCHIST"] },
];

export const mongo = new Database(dbConfig);

/************************
 *      BOT CONFIG      *
 ************************/

const config = {
  discordToken: process.env.DISCORD_TOKEN,
  botId: process.env.BOT_ID,
};
const commandsFunctions: any[] = [];

const init = async () => {
  await mongo.init();

  const commandList = await mongo.getCommands();
  const bot = new Arcybot(config, commandList, commandsFunctions);

  bot.start("Dr. Fetus reporting for destruction!");
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
