import { MongoID } from './mongo';

export interface Member extends MongoID {
  name: string;
  id: string;
  discordId?: number;
  avatar: string;
  url: string;
  updated: number;

  badges: MemberBadge[];
  games: MemberGame;
  ranking: MemberRanking;

  member: boolean;
  protected: boolean;
  private: boolean;
}

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

export type MemberRanking = Record<1 | 2 | 3 | 4 | 5, number>;

export type Achievement = {
  apiname: string;
  achieved: number; // 1 = yes, 0 = no
  unlocktime: number;
};
