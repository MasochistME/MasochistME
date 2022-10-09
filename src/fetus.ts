import axios from "axios";
import * as dotenv from "dotenv";
import { Arcybot } from "arcybot";
import { SDK } from "@masochistme/sdk/dist/v2/sdk";

import { getOption, Database } from "utils";
import { Cache } from "cache";

import { commandsFunctions, customCommands } from "commands";
import { handleAutocomplete, handleButtons } from "interactions";

dotenv.config();

/************************
 *        CONFIG        *
 ************************/

const botDb = process.env["ENV"] === "dev" ? "fetus-dev" : "fetus";

export const mongo = new Database([
  { symbol: botDb, url: process.env["DB_FETUS"] },
  { symbol: "masochist", url: process.env["DB_MASOCHIST"] },
]);

export const sdk = new SDK({
  host: "http://localhost:3002",
  authToken: process.env.ACCESS_TOKEN,
});

export const cache = new Cache({ botDb });

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

if (process.env.ACCESS_TOKEN)
  axios.defaults.headers.common["Authorization"] = process.env.ACCESS_TOKEN;
