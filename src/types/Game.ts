import { MongoID } from "./Mongo";

export interface Game extends MongoID {
  id: string;
  desc: string;
  rating: string;
  title: string;
  img: string;
  achievements: GameAchievement;
  url: string;
  sale: GameSale;
  curated: boolean;
  protected: boolean;
}

type GameSale = {
  onSale: boolean;
  discount: number;
};

type GameAchievement = {
  total: number;
  list: [];
};
