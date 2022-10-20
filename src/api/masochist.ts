import { mongo, mmeDb } from "fetus";
import { Badge, Game, Member, Points } from "types";

export const getAllBadgesFromAPI = async () => {
  const cursor = mongo.dbs[mmeDb].collection<Badge>("badges").find();
  const badges: Badge[] = [];
  await cursor.forEach(el => {
    badges.push(el);
  });
  return badges;
};

export const getAllMembesFromAPI = async () => {
  const cursor = mongo.dbs[mmeDb].collection<Member>("users").find();
  const members: Omit<Member, "games">[] = [];
  await cursor.forEach(el => {
    members.push(el);
  });
  return members;
};

export const getAllGamesFromAPI = async () => {
  const cursor = mongo.dbs[mmeDb].collection<Game>("games").find();
  const games: Omit<Game, "achievements" | "sale">[] = [];
  await cursor.forEach(el => {
    games.push(el);
  });
  return games;
};

export const getMemberFromAPI = async (discordId: string) => {
  const member: Member | null = await mongo.dbs[mmeDb]
    .collection<Member>("users")
    .findOne({ discordId });
  return member;
};

export const getPointsFromAPI = async () => {
  const cursor = mongo.dbs[mmeDb].collection<Points>("points").find();
  const points: Points[] = [];
  await cursor.forEach(el => {
    points.push(el);
  });
  return points;
};
