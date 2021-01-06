export type TPoints = {
  tier: number | 'badges';
  sum: number;
};

export type TUser = {
  id: number;
  patreon: {
    tier?: number;
  };
  points: {
    sum: number;
    tiers: TPoints[];
    badges: number;
  };
};

export type TUserGames = {
  id: number;
  playtime: number;
  percentage: number;
  lastUnlocked: number;
};
