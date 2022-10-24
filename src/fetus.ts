import axios from "axios";
import * as dotenv from "dotenv";
import { Arcybot } from "arcybot";
import { SDK } from "@masochistme/sdk/dist/v1/sdk";

import { getOption, Database } from "utils";
import { Cache } from "cache";
import { handleRaceTimer } from "commands/_utils/race";

import { commandsFunctions, customCommands } from "commands";
import { handleAutocomplete, handleButtons } from "interactions";

dotenv.config();

/************************
 *        CONFIG        *
 ************************/

const botDb = process.env["ENV"] === "dev" ? "fetus-dev" : "fetus";
const host =
  process.env["ENV"] === "dev"
    ? "http://localhost:3081"
    : "http://65.108.214.190:3081";

export const mongo = new Database([{ symbol: botDb, url: process.env["DB"] }]);

export const sdk = new SDK({
  host,
  authToken: process.env.ACCESS_TOKEN,
});

export const cache = new Cache({ botDb });

if (process.env.ACCESS_TOKEN)
  axios.defaults.headers.common["Authorization"] = process.env.ACCESS_TOKEN;

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

  // Race timer checks every minute if any race should start.
  handleRaceTimer();
};

init();
