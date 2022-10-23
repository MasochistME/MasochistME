import axios from 'axios';
import { Member, Game } from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

import { SteamGameDetailsData, MemberSteam } from '../types';
import { statusCurator, UpdateStatus } from '.';

type Update = { lastUpdate: Date; id: 'status' };

export const updateCuratorLogic = async (forceUpdate?: boolean) => {
  const { client, db } = await connectToDb();
  try {
    log.INFO(`--> [UPDATE] main update [INITIALIZED]`);

    /**
     * Check if the update was not called too early.
     */
    const collectionUpdate = db.collection<Update>('update');
    const lastUpdate = await collectionUpdate.findOne({ id: 'status' });

    const updateTooEarly =
      new Date(lastUpdate?.lastUpdate ?? 0).getTime() <=
      statusCurator.updateDelay;

    if (updateTooEarly && forceUpdate) {
      log.INFO(`--> [UPDATE] main update [TOO EARLY]`);
      return;
    }

    /**
     * Get curator members from the Steam API.
     */
    log.INFO(`--> [UPDATE] main update --> fetching members...`);
    const curatorMembersUrl = `http://steamcommunity.com/gid/${statusCurator.curatorId}/memberslistxml`;
    const curatorMembersData = await axios.get(curatorMembersUrl, {
      params: {
        xml: 1,
      },
    });
    const curatorMemberIds = getCuratorMemberIds(curatorMembersData.data);
    // http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${members[index].id}

    /**
     * Get curator members' details.
     */
    log.INFO(`--> [UPDATE] main update --> fetching members details...`);
    const curatorMembersDetailsUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002`;
    const curatorMembersDetailsData = await axios.get(
      curatorMembersDetailsUrl,
      {
        params: {
          key: process.env.STEAM_KEY,
          steamids: curatorMemberIds?.join(','),
        },
      },
    );
    const curatorMembersDetails: Member[] = (
      curatorMembersDetailsData.data?.response?.players ?? []
    ).map((member: MemberSteam) => ({
      name: member.personaname,
      avatarHash: member.avatarhash,
    }));

    /**
     * Compare new member list with the data in database.
     */
    // TODO
    log.INFO(
      `--> [UPDATE] main update --> comparing members with the database...`,
    );
    const collectionMembers = db.collection<Member>('members');
    const membersCursor = await collectionMembers.find();
    const oldMembers: Member[] = [];
    await membersCursor.forEach((el: Member) => {
      oldMembers.push(el);
    });

    /**
     * Get curator games from the Steam API.
     */
    log.INFO(`--> [UPDATE] main update --> fetching games...`);
    const curatorGamesUrl = `http://store.steampowered.com/curator/${statusCurator.curatorId}/ajaxgetfilteredrecommendations/render`;
    const curatorGamesData = await axios.get(curatorGamesUrl, {
      params: {
        start: 0,
        count: 1000,
        sort: 'recent',
        types: 0,
      },
    });
    const curatorGames =
      getCuratorGamesData(curatorGamesData.data.results_html) ?? [];
    const curatedGamesDetails = await getCuratorGamesDetailsRecurrent(
      curatorGames.splice(0, 3),
    );

    /**
     * Get detailed data of the curated games.
     */
    log.INFO(`--> [UPDATE] main update --> fetching game details...`);

    /**
     * Compare new games list with the data in database.
     */
    // TODO
    log.INFO(
      `--> [UPDATE] main update --> comparing games with the database...`,
    );
    const collectionGames = db.collection<Game>('games');
    const gamesCursor = await collectionGames.find();
    const oldGames: Game[] = [];
    await gamesCursor.forEach((el: Game) => {
      oldGames.push(el);
    });

    /**
     * Create all curator events.
     */
    console.log('TODO events');

    /**
     * Fin!
     */
    log.INFO(`--> [UPDATE] main update [END]`);
  } catch (err: any) {
    log.INFO(`--> [UPDATE] main update [ERROR]`);
    log.WARN(err.message ?? err);
    /**
     * Set the update status to error.
     */
    statusCurator.updateProgress = 0;
    statusCurator.updateStatus = UpdateStatus.ERROR;
  }
};

/**
 * Function fetching IDs of current members of curator.
 * @param curatorMembersData string
 */
const getCuratorMemberIds = (curatorMembersData: string) => {
  const idsRegex = new RegExp(/(?<=<steamID64>)(.*)(?=<\/steamID64>)/gim);
  const ids = curatorMembersData.match(idsRegex);
  return ids;
};

/**
 * Function fetching IDs of current members of curator.
 * @param curatorGamesData string
 */
const getCuratorGamesData = (curatorGamesData: string) => {
  const idsRegex = new RegExp(
    /(?<=data-ds-appid=\")(.*?)(?=\" data-ds-itemkey)/gm,
  );
  const ids = curatorGamesData.match(idsRegex);

  /**
   * We need to get game description as well because of the start system.
   * Stars included in the game description indicate game's tier.
   */
  const descRegex = new RegExp(
    /(?<=recommendation_desc">)([\s\S]*?)(?=<\/div)/gs,
  );
  const desc = curatorGamesData.match(descRegex) ?? [];
  const gamesData = ids?.map((id, index) => ({
    id,
    description:
      desc[index]?.replace(/\r/g, '').replace(/\n/g, '').replace(/\t/g, '') ??
      '',
  }));
  return gamesData;
};

/**
 * Recurrency function getting detailed data of all the curated games.
 * We need to check game after game, we cannot check all of them at once.
 * Reference: https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI#Parameters_3
 * @param curatorGames {id: number, description:string}[]
 */
const getCuratorGamesDetailsRecurrent = (
  curatorGames: { id: string; description: string }[],
) =>
  new Promise(resolve => {
    const curatorGamesIds = curatorGames?.map(game => Number(game.id)) ?? [];
    const curatorGameDetails: Omit<Game, '_id' | 'tier'>[] = [];

    const getDetailedCuratorGamesData = async (gameIndex: number) => {
      const details = await getCuratorGameDetails(curatorGamesIds[gameIndex]);
      curatorGameDetails.push(details);
      if (curatorGamesIds[gameIndex + 1]) {
        setTimeout(
          () => getDetailedCuratorGamesData(gameIndex + 1),
          Number(process.env.DELAY),
        );
      } else {
        log.INFO(`----> [UPDATE] game details ${gameIndex}`);
        resolve(curatorGameDetails);
      }
    };

    getDetailedCuratorGamesData(0);
  });

/**
 * Get details of a single Steam game.
 * @param gameId number
 */
const getCuratorGameDetails = async (
  gameId: number,
): Promise<Omit<Game, '_id' | 'tier'>> => {
  const curatorGameDetailsUrl = `http://store.steampowered.com/api/appdetails`;
  const curatorGameDetailsData = await axios.get(curatorGameDetailsUrl, {
    params: {
      appids: gameId,
      filters: 'price_overview,basic,achievements',
    },
  });
  const details: SteamGameDetailsData =
    curatorGameDetailsData.data?.[gameId]?.data;
  const finalGame: Omit<Game, '_id' | 'tier'> = {
    id: Number(gameId),
    title: details.name,
    description: '', // this comes from the Curator descipriton
    achievementsTotal: details.achievements.total,
    sale: details.price_overview.discount_percent ?? 0,
    isCurated: true,
    isProtected: false,
  };
  return finalGame;
};
