import { CommandObject } from "arcybot";
import { Badge, Race, Season, Tier } from "@masochistme/sdk/dist/v1/types";

import { getCommandsFromAPI, getAllOptionsFromAPI } from "api";
import { sdk } from "fetus";

import { CacheMember, CacheGame, CacheOption } from "./types";

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
  public tiers: Tier[] = [];
  public seasons: Season[] = [];
  public races: Race[] = [];
  public commandList: CommandObject[] = [];

  constructor(config: CacheConfig) {
    this.botDb = config.botDb ?? "";
    this.masochistDb = config.masochistDb ?? "";
  }

  private async updateFetus() {
    this.commandList = await getCommandsFromAPI();
    this.options = await getAllOptionsFromAPI();
  }

  async updateMasochist() {
    this.tiers = await sdk.getTiersList({});
    this.badges = await sdk.getBadgesList({});
    this.seasons = await sdk.getSeasonsList({ filter: {} });
    this.races = await sdk.getRaceList({ filter: {} });
    this.members = (await sdk.getMembersList({}))
      .map(m => ({ name: m.name, id: m.steamId, discordId: m.discordId }))
      .sort();
    this.games = (await sdk.getGamesList({}))
      .map(g => ({ name: g.title, description: g.description, id: g.id }))
      .sort();
  }

  async update() {
    await this.updateFetus();
    await this.updateMasochist();
  }
}
