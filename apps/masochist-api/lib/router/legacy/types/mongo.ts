import { ObjectId } from 'mongodb';

export type MongoID = { _id: ObjectId };

export interface Meme extends MongoID {
  meme: string;
}

export interface Badge extends MongoID {
  name: string;
  img: string;
  points: string;
  requirements: string;
  description: string;
  gameId: string;
  enabled: boolean;
  legacy: boolean;
}
