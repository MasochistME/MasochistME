import { CommandObject } from "arcybot";

import { CacheOption } from "types";
import { mongo } from "fetus";

export const getCommandsFromAPI = async () => {
  const cursor = mongo.dbs.fetus.collection<CommandObject>("commands").find();
  const commands: CommandObject[] = [];
  await cursor.forEach(el => {
    commands.push(el);
  });
  return commands;
};

export const getAllOptionsFromAPI = async () => {
  const cursor = mongo.dbs.fetus.collection<CacheOption>("options").find();
  const options: CacheOption[] = [];
  await cursor.forEach(el => {
    options.push(el);
  });
  return options;
};
