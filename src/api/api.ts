import { CommandObject } from "arcybot";

import { mongo } from "fetus";

export const getCommandsFromAPI = async () => {
  const cursor = mongo.dbs.fetus.collection<CommandObject>("commands").find();
  const commands: CommandObject[] = [];
  await cursor.forEach(el => {
    commands.push(el);
  });
  return commands;
};
