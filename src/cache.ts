import {
  getCommandsFromAPI,
  getAllBadgesFromAPI,
  getAllMembesFromAPI,
  getAllGamesFromAPI,
} from "api";
import { CommandObject } from "arcybot";

export type CacheItem = {
  name: string;
  id: string | number;
};

type CacheMember = CacheItem;
interface CacheBadge extends CacheItem {
  gameId: string;
  description: string;
}
interface CacheGame extends CacheItem {
  description: string;
}

export class Cache {
  public badges: CacheBadge[] = [];
  public members: CacheMember[] = [];
  public games: CacheGame[] = [];
  public commandList: CommandObject[] = [];

  async update() {
    this.commandList = await getCommandsFromAPI();
    this.badges = (await getAllBadgesFromAPI())
      .map(b => ({
        name: b.name,
        description: b.description,
        gameId: b.gameId,
        id: b._id.toString(),
      }))
      .sort();
    this.members = (await getAllMembesFromAPI())
      .map(m => ({ name: m.name, id: m.id }))
      .sort();
    this.games = (await getAllGamesFromAPI())
      .map(g => ({ name: g.title, description: g.desc, id: g.id }))
      .sort();
  }
}
