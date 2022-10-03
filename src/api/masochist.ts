import { mongo } from "fetus";
import { Badge, Member } from "types";

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
  const members: Member[] = [];
  await cursor.forEach(el => {
    members.push(el);
  });
  return members;
};
