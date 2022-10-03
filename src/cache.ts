import { getAllBadgesFromAPI, getAllMembesFromAPI } from "api";

export type CacheItem = {
  name: string;
  id: string | number;
};

export class Cache {
  public badges: CacheItem[] = [];
  public members: CacheItem[] = [];

  async init() {
    this.badges = (await getAllBadgesFromAPI())
      .map(b => ({ name: b.name, id: b._id.toString() }))
      .sort();
    this.members = (await getAllMembesFromAPI())
      .map(m => ({ name: m.name, id: m.id }))
      .sort();
  }
}
