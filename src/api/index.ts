import { ObjectId } from "mongodb";
import { CommandObject, log } from "arcybot";

import { Meme } from "types";
import { mongo } from "fetus";

export const getCommandsFromAPI = async () => {
  const cursor = mongo.dbs.fetus.collection<CommandObject>("commands").find();
  const commands: CommandObject[] = [];
  await cursor.forEach(el => {
    commands.push(el);
  });
  return commands;
};

export const getMemesFromAPI = async () => {
  const cursor = mongo.dbs.fetus.collection<Meme>("memes").find();
  const memes: Meme[] = [];
  await cursor.forEach(el => {
    memes.push(el);
  });
  return memes;
};

export const getRandomMemeFromAPI = async () => {
  const cursor = mongo.dbs.fetus
    .collection("memes")
    .aggregate([{ $sample: { size: 1 } }]);
  let meme = "";
  await cursor.forEach(el => {
    meme = el.meme;
  });
  return meme;
};

export const addMemeToAPI = async (meme: string | null) => {
  if (!meme) throw new Error("Meme has no body.");
  await mongo.dbs.fetus.collection("memes").insertOne({ meme });
  log.INFO(`Succesfully added a new meme!`);
};

export const deleteMemeFromAPI = async (memeToDeleteId: ObjectId) => {
  await mongo.dbs.fetus.collection("memes").deleteOne({ _id: memeToDeleteId });
  log.INFO(`Succesfully deleted a meme!`);
};
