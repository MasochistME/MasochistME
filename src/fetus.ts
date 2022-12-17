import * as dotenv from "dotenv";
import { Arcybot, log } from "arcybot";
import {
  CacheType,
  GatewayIntentBits,
  Interaction,
  Partials,
} from "discord.js";
import { SDK } from "@masochistme/sdk/dist/v1/sdk";

import { getOption, Database } from "utils";
import { Cache } from "cache";
// import { handleRaceTimer } from "commands/_utils/race";

import { commandsFunctions, customCommands } from "commands";
import { handleAutocomplete, handleButtons } from "interactions";

dotenv.config();

/************************
 *        CONFIG        *
 ************************/

const botDb = process.env["ENV"] === "dev" ? "fetus-dev" : "fetus";
export const mmeDb =
  process.env["ENV"] === "dev" ? "masochist-dev" : "masochist";

const host =
  process.env["ENV"] === "dev"
    ? "http://localhost:3081"
    : "http://65.108.214.190:3002";

export const mongo = new Database([{ symbol: botDb, url: process.env["DB"] }]);

export const sdk = new SDK({
  host,
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
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  };

  bot = new Arcybot(
    config,
    cache.commandList,
    commandsFunctions,
    // @ts-ignore
    customCommands,
  );

  bot.start("Dr. Fetus reporting for destruction!");

  bot.botClient.on("ready", async () => {
    // Race timer checks every minute if any race should start.
    // TODO reenable when needed
    // handleRaceTimer();
  });

  bot.botClient.on("interactionCreate", async interaction => {
    debug(interaction);
    if (interaction.isAutocomplete()) handleAutocomplete(interaction);
    if (interaction.isButton()) handleButtons(interaction);
  });

  // Debug mode
  bot.botClient.on("error", async error => {
    log.DEBUG("Discord bot error detected");
    console.log(error);
  });

  bot.botClient.on("warn", async (message: string) => {
    log.DEBUG("Discord bot warning detected");
    console.log(message);
  });
};

init();

const debug = async (interaction: Interaction<CacheType>) => {
  log.DEBUG(`NEW INTERACTION`);
  log.DEBUG(`-> interaction type: ${interaction.type}`);
  log.DEBUG(`-> user: ${interaction.user.username}`);
  if (interaction.isCommand()) {
    log.DEBUG("-> type: COMMAND");
    log.DEBUG(`-> command: ${interaction.commandName}`);
    log.DEBUG(
      // @ts-ignore
      `-> options: ${interaction.options["_hoistedOptions"]?.map(
        (option: any) => `\n ---> ${option.name} => ${option.value}`,
      )}`,
    );
  }
  if (interaction.isAutocomplete()) {
    log.DEBUG("-> type: AUTOCOMPLETE");
    log.DEBUG(`-> autocomplete: ${interaction.commandName}`);
  }
  if (interaction.isButton()) {
    log.DEBUG("-> type: BUTTON");
    log.DEBUG(`-> button: ${interaction.customId}`);
  }
};
