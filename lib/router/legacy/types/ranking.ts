export type TPoints = {
  tier?: number;
  total: number;
  points: number;
};

export type TUser = {
  id: number;
  patreon: {
    tier?: number;
  };
  points: {
    sum: number;
    tiers: TPoints[];
    badges: TPoints;
  };
};

export type TUserGames = {
  id: number;
  playtime: number;
  percentage: number;
  lastUnlocked: number;
};
