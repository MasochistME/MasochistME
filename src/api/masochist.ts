import { cache, mongo } from "fetus";
import { Game, Member, Points } from "types";

export const getAllMembesFromAPI = async () => {
  const cursor = mongo.dbs[cache.masochistDb]
    .collection<Member>("members")
    .find();
  const members: Omit<Member, "games">[] = [];
  await cursor.forEach(el => {
    members.push(el);
  });
  return members;
};

export const getAllGamesFromAPI = async () => {
  const cursor = mongo.dbs[cache.masochistDb].collection<Game>("games").find();
  const games: Omit<Game, "achievements" | "sale">[] = [];
  await cursor.forEach(el => {
    games.push(el);
  });
  return games;
};

export const getMemberFromAPI = async (discordId: string) => {
  const member: Member | null = await mongo.dbs[cache.masochistDb]
    .collection<Member>("members")
    .findOne({ discordId });
  return member;
};

export const getPointsFromAPI = async () => {
  const cursor = mongo.dbs[cache.masochistDb]
    .collection<Points>("points")
    .find();
  const points: Points[] = [];
  await cursor.forEach(el => {
    points.push(el);
  });
  return points;
};
