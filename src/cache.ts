import { CommandObject } from "arcybot";

import { CacheMember, CacheBadge, CacheGame, CacheOption } from "types";
import {
  getCommandsFromAPI,
  getAllOptionsFromAPI,
  getAllBadgesFromAPI,
  getAllMembesFromAPI,
  getAllGamesFromAPI,
} from "api";

export class Cache {
  public badges: CacheBadge[] = [];
  public members: CacheMember[] = [];
  public games: CacheGame[] = [];
  public options: CacheOption[] = [];
  public commandList: CommandObject[] = [];

  async update() {
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
