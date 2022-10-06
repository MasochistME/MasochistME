import { CommandObject } from "arcybot";

import { CacheMember, CacheBadge, CacheGame, CacheOption, Points } from "types";
import {
  getCommandsFromAPI,
  getPointsFromAPI,
  getAllOptionsFromAPI,
  getAllBadgesFromAPI,
  getAllMembesFromAPI,
  getAllGamesFromAPI,
} from "api";

type CacheConfig = {
  botDb?: string;
};

export class Cache {
  public botDb: string;
  public badges: CacheBadge[] = [];
  public members: CacheMember[] = [];
  public games: CacheGame[] = [];
  public options: CacheOption[] = [];
  public points: Points[] = [];
  public commandList: CommandObject[] = [];

  constructor(config: CacheConfig) {
    this.botDb = config.botDb ?? "";
  }

  async update() {
    this.points = await getPointsFromAPI();
    this.commandList = await getCommandsFromAPI();
    this.options = await getAllOptionsFromAPI();
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
