import { CommandObject } from "arcybot";

import { CacheMember, CacheGame, CacheOption, Points } from "types";
import {
  getCommandsFromAPI,
  getPointsFromAPI,
  getAllOptionsFromAPI,
  getAllMembesFromAPI,
  getAllGamesFromAPI,
} from "api";

import { sdk } from "fetus";
import { Badge } from "@masochistme/sdk/dist/v1/types";

type CacheConfig = {
  botDb?: string;
  masochistDb?: string;
};

export class Cache {
  public botDb: string;
  public masochistDb: string;

  public badges: Badge[] = [];
  public members: CacheMember[] = [];
  public games: CacheGame[] = [];
  public options: CacheOption[] = [];
  public points: Points[] = [];
  public commandList: CommandObject[] = [];

  constructor(config: CacheConfig) {
    this.botDb = config.botDb ?? "";
    this.masochistDb = config.masochistDb ?? "";
  }

  async update() {
    this.badges = await sdk.getBadgesList();
    this.points = await getPointsFromAPI();
    this.commandList = await getCommandsFromAPI();
    this.options = await getAllOptionsFromAPI();
    this.members = (await getAllMembesFromAPI())
      .map(m => ({ name: m.name, id: m.id }))
      .sort();
    this.games = (await getAllGamesFromAPI())
      .map(g => ({ name: g.title, description: g.desc, id: g.id }))
      .sort();
  }
}
