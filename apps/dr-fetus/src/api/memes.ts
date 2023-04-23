import { ObjectId } from "mongodb";
import { log } from "arcybot";

import { Meme } from "cache";
import { mongo, cache } from "fetus";

export const getMemesFromAPI = async () => {
  const cursor = mongo.dbs[cache.botDb].collection<Meme>("memes").find();
  const memes: Meme[] = [];
  await cursor.forEach(el => {
    memes.push(el);
  });
  return memes;
};

export const getRandomMemeFromAPI = async () => {
  const cursor = mongo.dbs[cache.botDb]
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
  await mongo.dbs[cache.botDb].collection("memes").insertOne({ meme });
  log.INFO(`Succesfully added a new meme!`);
};

export const deleteMemeFromAPI = async (memeToDeleteId: ObjectId) => {
  await mongo.dbs[cache.botDb]
    .collection("memes")
    .deleteOne({ _id: memeToDeleteId });
  log.INFO(`Succesfully deleted a meme!`);
};
