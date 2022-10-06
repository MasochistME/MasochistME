import { WithId } from "mongodb";

export type Member = WithId<{
  name: string;
  id: number;
  discordId?: string;
  description?: string;
  avatar: string;
  url: string;
  updated: number;

  badges: MemberBadge[];
  games: MemberGame[];
  ranking: MemberRanking;

  member: boolean;
  protected: boolean;
  private: boolean;
}>;

export type MemberGame = {
  appid: number;
  playtime_forever: string;
  completionRate: number; // 0-100
  lastUnlocked: number;
  achievements: Achievement[];
};

export type MemberBadge = {
  id: string;
  unlocked: number;
};

export type MemberRanking = Record<string, number>; // key = "1" | "2" | "3" | "4" | "5"

export type Achievement = {
  apiname: string;
  achieved: number; // 1 = yes, 0 = no
  unlocktime: number;
};
