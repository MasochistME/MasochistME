import { ObjectId } from "mongodb";

export type CacheItem = {
  name: string;
  id: string | number;
};

export type CacheMember = CacheItem;

export interface CacheGame extends CacheItem {
  description: string;
}

export interface CacheOption {
  _id: ObjectId;
  option: string;
  value: string;
}
