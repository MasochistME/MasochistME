import { WithId } from "mongodb";

export type Meme = WithId<{
  meme: string;
}>;

export type Badge = WithId<{
  name: string;
  img: string;
  points: string;
  requirements: string;
  description: string;
  gameId: string;
  enabled: boolean;
  legacy: boolean;
}>;

export type Points = WithId<{
  symbol: string;
  icon: string;
  score: number;
  description: string;
  id: string;
}>;
