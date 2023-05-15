import { ObjectId, WithId } from "mongodb";

export type Meme = WithId<{
  meme: string;
}>;

export type CacheItem = {
  name: string;
  id: string | number;
};

export interface CacheMember extends CacheItem {
  discordId: string | null;
}

export interface CacheGame extends CacheItem {
  description: string;
}

export interface CacheOption {
  _id: ObjectId;
  option: string;
  value: any;
}
