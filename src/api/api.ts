import { CommandObject } from "arcybot";

import { CacheOption } from "cache";
import { mongo, cache } from "fetus";

export const getCommandsFromAPI = async () => {
  const cursor = mongo.dbs[cache.botDb]
    .collection<CommandObject>("commands")
    .find();
  const commands: CommandObject[] = [];
  await cursor.forEach(el => {
    if (!el.isDisabled) commands.push(el);
  });
  return commands;
};

export const getAllOptionsFromAPI = async () => {
  const cursor = mongo.dbs[cache.botDb]
    .collection<CacheOption>("options")
    .find();
  const options: CacheOption[] = [];
  await cursor.forEach(el => {
    options.push(el);
  });
  return options;
};
