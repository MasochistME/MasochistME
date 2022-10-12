import { WithId } from "mongodb";

export type Meme = WithId<{
  meme: string;
}>;

export type Points = WithId<{
  symbol: string;
  icon: string;
  score: number;
  description: string;
  id: string;
}>;
