import './instrument';

import * as dotenv from 'dotenv';
import { Arcybot } from 'arcybot';
import { GatewayIntentBits, Partials } from 'discord.js';
import { SDK } from '@masochistme/sdk/dist/v1/sdk';

import { getOption, log, Database } from 'utils';
import { Cache } from 'cache';
import { handleRaceTimer } from 'commands/_utils/race';

import { commandsFunctions, customCommands } from 'commands';
import { handleModals, handleAutocomplete, handleButtons } from 'interactions';

dotenv.config();

/************************
 *        CONFIG        *
 ************************/

const botDb = process.env['ENV'] === 'dev' ? 'fetus-dev' : 'fetus';
export const mmeDb =
  process.env['ENV'] === 'dev' ? 'masochist-dev' : 'masochist';

const host =
  process.env['ENV'] === 'dev'
    ? 'http://localhost:3081'
    : 'https://api.masochist.me';

export const mongo = new Database([{ symbol: botDb, url: process.env['DB'] }]);

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
    modRole: getOption('modRole') as string,
    guildId: getOption('guildId') as string,
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

  bot.start('Dr. Fetus reporting for destruction!');

  bot.botClient
    .on('ready', async () => {
      // Race timer checks every minute if any race should get updated.
      handleRaceTimer();
    })
    .on('interactionCreate', async interaction => {
      if (interaction.isAutocomplete()) handleAutocomplete(interaction);
      if (interaction.isButton()) handleButtons(interaction);
      if (interaction.isModalSubmit()) handleModals(interaction);
    })
    .on('error', async error => {
      log.ERROR(error);
    })
    .on('warn', async (message: string) => {
      log.DEBUG(message);
    });
  // .on("debug", console.log);
};

init();
