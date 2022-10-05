import { mongo } from "fetus";
import { Badge, Member, Game } from "types";

export const getAllBadgesFromAPI = async () => {
  const cursor = mongo.dbs.masochist.collection<Badge>("badges").find();
  const badges: Badge[] = [];
  await cursor.forEach(el => {
    badges.push(el);
  });
  return badges;
};

export const getAllMembesFromAPI = async () => {
  const cursor = mongo.dbs.masochist.collection<Member>("users").find();
  const members: Omit<Member, "games">[] = [];
  await cursor.forEach(el => {
    members.push(el);
  });
  return members;
};

export const getAllGamesFromAPI = async () => {
  const cursor = mongo.dbs.masochist.collection<Game>("games").find();
  const games: Omit<Game, "achievements" | "sale">[] = [];
  await cursor.forEach(el => {
    games.push(el);
  });
  return games;
};
