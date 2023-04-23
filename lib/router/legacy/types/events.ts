export type TMemberJoinedEvent = {
  date: number;
  type: 'memberJoined';
  member: string;
};
export type TMemberLeftEvent = {
  date: number;
  type: 'memberLeft';
  member: string;
};
export type TTierChangeEvent = {
  date: number;
  type: 'tierChange';
  game: string | number;
  oldTier: string | number;
  newTier: string | number;
};
export type TGameEvent = {
  date: number;
  type: 'newGame' | 'gameRemoved';
  game: string;
};
export type TBadgeAddedEvent = {
  date: number;
  type: 'badgeAdded';
  badge: string;
  game: string;
};
export type TBadgeGivenEvent = {
  date: number;
  type: 'badgeGiven';
  badge: string;
  member: string;
};
