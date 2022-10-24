import axios from 'axios';
import { Response } from 'express';
import {
  Member,
  Game,
  EventType,
  EventMemberJoin,
  EventMemberLeave,
  EventGameRemove,
  EventGameAdd,
  EventAchievementNumberChange,
  EventGameTierChange,
  Tier,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';
import { splitArrayToChunks } from 'helpers';

import { SteamGameDetailsData, MemberSteam } from '../types';
import { statusCurator, UpdateStatus } from '.';

type Update = { lastUpdate: Date; id: 'status' };

export const updateCuratorLogic = async (
  forceUpdate?: boolean,
  res?: Response,
) => {
  const { client, db } = await connectToDb();
  try {
    log.INFO(`--> [UPDATE] main update [INITIALIZED]`);

    /**
     * Check if the update was not called too early.
     */
    const collectionUpdate = db.collection<Update>('update');
    const lastUpdate = await collectionUpdate.findOne({ id: 'status' });

    const updateTooEarly =
      Date.now() - new Date(lastUpdate?.lastUpdate ?? 0).getTime() <=
      statusCurator.updateDelay;
    if (updateTooEarly && !forceUpdate) {
      log.INFO(`--> [UPDATE] main update [TOO EARLY]`);
      if (res) res.status(400).send('You cannot call update so early.');
      return;
    }
    if (res) res.status(202).send('Curator update started.');

    statusCurator.updateStatus = UpdateStatus.ONGOING;
    statusCurator.updateProgress = 0;
    statusCurator.isUpdating = true;

    /**
     * Get curator members from the Steam API.
     */
    log.INFO(`--> [UPDATE] main update --> fetching members...`);
    statusCurator.updateProgress = 1;
    const curatorMembersUrl = `http://steamcommunity.com/gid/${statusCurator.curatorId}/memberslistxml`;
    const curatorMembersData = await axios.get(curatorMembersUrl, {
      params: {
        xml: 1,
      },
    });
    const curatorMemberIds = getCuratorMemberIds(curatorMembersData.data);

    /**
     * Compare new member list with the data in database.
     */
    log.INFO(
      `--> [UPDATE] main update --> comparing members with the database...`,
    );
    statusCurator.updateProgress = 5;
    const collectionMembers = db.collection<Omit<Member, '_id'>>('members');
    const membersCursor = await collectionMembers.find();
    const oldMembers: Member[] = [];
    await membersCursor.forEach((el: Member) => {
      oldMembers.push(el);
    });

    /**
     * Handle members who left.
     */
    const membersWhoLeft = oldMembers
      ?.filter(
        oldMember =>
          !oldMember.isProtected &&
          oldMember.isMember &&
          !curatorMemberIds.includes(oldMember.steamId),
      )
      .map(memberWhoLeft => memberWhoLeft.steamId);

    if (membersWhoLeft.length) {
      log.INFO(
        `--> [UPDATE] main update --> handling ${membersWhoLeft.length} members that left [START]`,
      );
      statusCurator.updateProgress = 10;

      const responseRemoveMembersWhoLeft = await collectionMembers.updateMany(
        { $or: membersWhoLeft.map(id => ({ steamId: id })) },
        { $set: { isMember: false } },
      );

      log.INFO(
        `--> [UPDATE] main update --> removing ${
          membersWhoLeft.length
        } members that left [${
          responseRemoveMembersWhoLeft.acknowledged ? 'SUCCESS' : 'ERROR'
        }]`,
      );

      const collectionEventsMemberLeave =
        db.collection<Omit<EventMemberLeave, '_id'>>('events');
      membersWhoLeft.forEach(async memberId => {
        const responseEvent = await collectionEventsMemberLeave.insertOne({
          type: EventType.MEMBER_LEAVE,
          memberId,
          date: new Date(),
        });
        log.INFO(
          `--> [UPDATE] main update --> generating MemberLeave events [${
            responseEvent.acknowledged ? 'SUCCESS' : 'ERROR'
          }]`,
        );
      });

      log.INFO(
        `--> [UPDATE] main update --> handling ${membersWhoLeft.length} members that left [END]`,
      );
      statusCurator.updateProgress = 15;
    }

    /**
     * Handle members who joined and update the basic info of the old ones.
     */
    const membersWhoJoined = curatorMemberIds?.filter(
      id => !oldMembers.find(oldMember => oldMember.steamId === id),
    );

    log.INFO(`--> [UPDATE] main update --> updating members [START]`);

    const curatorMemberIdsChunks = splitArrayToChunks(curatorMemberIds, 100);
    const curatorMembersDetailsUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002`;

    // We have to split this request to chunks cause it does not return more than 100 members at once.
    const curatorMembersDetailsData = await Promise.all(
      curatorMemberIdsChunks.map(chunk =>
        axios.get(curatorMembersDetailsUrl, {
          params: {
            key: process.env.STEAM_KEY,
            steamids: chunk?.join(','),
          },
        }),
      ),
    );

    const curatorMembersDetails: MemberSteam[] = curatorMembersDetailsData
      .map(raw => raw.data?.response?.players ?? [])
      .flat();

    const curatorNewMembersDetails: Omit<Member, '_id'>[] =
      curatorMembersDetails
        .filter(member => membersWhoJoined.includes(member.steamid))
        .map((member: MemberSteam) => ({
          name: member.personaname,
          steamId: member.steamid,
          discordId: null,
          description: null,
          avatar: member.avatarfull,
          avatarHash: member.avatarhash,
          lastUpdated: new Date(0),
          isPrivate: member.communityvisibilitystate === 1,
          isMember: true,
          isProtected: false,
        }));

    if (curatorNewMembersDetails.length) {
      log.INFO(
        `--> [UPDATE] main update --> saving ${curatorNewMembersDetails.length} new members [START]`,
      );

      const responseAddNewMembers = await collectionMembers.insertMany(
        curatorNewMembersDetails,
      );

      const collectionEventsMemberJoin =
        db.collection<Omit<EventMemberJoin, '_id'>>('events');
      membersWhoJoined.forEach(async memberId => {
        await collectionEventsMemberJoin.insertOne({
          type: EventType.MEMBER_JOIN,
          memberId,
          date: new Date(),
        });
      });
      log.INFO(
        `--> [UPDATE] main update --> saving new members [${
          responseAddNewMembers.acknowledged ? 'SUCCESS' : 'ERROR'
        }]`,
      );
      statusCurator.updateProgress = 20;
    }

    const curatorUpdatedMembersDetails: Partial<Member>[] =
      curatorMembersDetails
        .map((member: MemberSteam) => ({
          name: member.personaname,
          steamId: member.steamid,
          avatar: member.avatarfull,
          avatarHash: member.avatarhash,
          isPrivate: member.communityvisibilitystate === 1,
        }))
        // Filter members by updatable fields changing
        .filter((memberNew: Partial<Member>) => {
          const memberPrev = oldMembers.find(
            m => m.steamId === memberNew.steamId,
          );
          if (!memberPrev) return false; // ignore new members as we already handled them
          return (
            memberPrev.name !== memberNew.name ||
            memberPrev.avatar !== memberNew.avatar ||
            memberPrev.avatarHash !== memberNew.avatarHash ||
            memberPrev.isPrivate !== memberNew.isPrivate
          );
        });

    if (curatorUpdatedMembersDetails.length) {
      log.INFO(
        `--> [UPDATE] main update --> updating ${curatorUpdatedMembersDetails.length} old members [START]`,
      );
      curatorUpdatedMembersDetails.forEach(async member => {
        const responseUpdateOldMember = await collectionMembers.updateOne(
          {
            steamId: member.steamId,
          },
          {
            $set: {
              name: member.name,
              avatar: member.avatar,
              avatarHash: member.avatarHash,
              isPrivate: member.isPrivate,
            },
          },
        );
        log.INFO(
          `--> [UPDATE] main update --> updating member ${member.steamId} [${
            responseUpdateOldMember.acknowledged ? 'SUCCESS' : 'ERROR'
          }]`,
        );
      });
    }

    log.INFO(`--> [UPDATE] main update --> updating members [END]`);
    statusCurator.updateProgress = 25;

    /**
     * Get tiers from database.
     */
    const collectionTiers = db.collection<Tier>('tiers');
    const tiersCursor = await collectionTiers.find();
    const tiers: Tier[] = [];
    await tiersCursor.forEach((el: Tier) => {
      tiers.push(el);
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

    log.INFO(`--> [UPDATE] main update --> fetching game details...`);

    const curatorGamesDetails = (await getCuratorGamesDetailsRecurrent(
      curatorGames,
      tiers,
    )) as Omit<Game, '_id'>[];
    const curatorGamesIds = curatorGamesDetails.map(g => g.id);

    /**
     * Compare new games list with the data in database.
     */
    log.INFO(
      `--> [UPDATE] main update --> comparing games with the database...`,
    );
    statusCurator.updateProgress = 90;
    const collectionGames = db.collection<Omit<Game, '_id'>>('games');
    const gamesCursor = await collectionGames.find();
    const oldGames: Game[] = [];
    await gamesCursor.forEach((el: Game) => {
      oldGames.push(el);
    });

    /**
     * Handle removed games.
     */
    const gamesThatGotRemoved = oldGames
      ?.filter(
        oldGame =>
          !oldGame.isProtected &&
          oldGame.isCurated &&
          !curatorGamesIds.includes(oldGame.id),
      )
      .map(gameThatGotRemoved => gameThatGotRemoved.id);

    if (gamesThatGotRemoved.length) {
      log.INFO(
        `--> [UPDATE] main update --> handling ${gamesThatGotRemoved.length} removed games [START]`,
      );

      const responseRemoveGamesThatGotRemoved =
        await collectionGames.updateMany(
          { $or: gamesThatGotRemoved.map(id => ({ id })) },
          { $set: { isCurated: false } },
        );

      log.INFO(
        `--> [UPDATE] main update --> removing ${
          gamesThatGotRemoved.length
        } games that got removed [${
          responseRemoveGamesThatGotRemoved.acknowledged ? 'SUCCESS' : 'ERROR'
        }]`,
      );

      const collectionEventsGamesRemoved =
        db.collection<Omit<EventGameRemove, '_id'>>('events');

      gamesThatGotRemoved.forEach(async gameId => {
        const responseEvent = await collectionEventsGamesRemoved.insertOne({
          type: EventType.GAME_REMOVE,
          gameId,
          date: new Date(),
        });
        log.INFO(
          `--> [UPDATE] main update --> generating GameRemove events [${
            responseEvent.acknowledged ? 'SUCCESS' : 'ERROR'
          }]`,
        );
      });

      log.INFO(
        `--> [UPDATE] main update --> handling ${gamesThatGotRemoved.length} removed games [END]`,
      );
    }

    /**
     * Handle new games.
     */
    statusCurator.updateProgress = 95;

    const gamesThatGotAdded = curatorGamesIds?.filter(
      id => !oldGames.find(oldGame => oldGame.id === id),
    );

    log.INFO(`--> [UPDATE] main update --> updating games [START]`);

    const curatorNewGamesDetails: Omit<Game, '_id'>[] =
      curatorGamesDetails.filter(game => gamesThatGotAdded.includes(game.id));

    if (curatorNewGamesDetails.length) {
      log.INFO(
        `--> [UPDATE] main update --> saving ${curatorNewGamesDetails.length} new games [START]`,
      );

      const responseAddNewGames = await collectionGames.insertMany(
        curatorNewGamesDetails,
      );

      const collectionEventsGamesAdd =
        db.collection<Omit<EventGameAdd, '_id'>>('events');

      gamesThatGotAdded.forEach(async gameId => {
        await collectionEventsGamesAdd.insertOne({
          type: EventType.GAME_ADD,
          gameId,
          date: new Date(),
        });
      });

      log.INFO(
        `--> [UPDATE] main update --> saving new games [${
          responseAddNewGames.acknowledged ? 'SUCCESS' : 'ERROR'
        }]`,
      );
    }

    // STUFF here

    /**
     * Handle updated games.
     */
    statusCurator.updateProgress = 99;
    const curatorUpdatedGamesDetails: Partial<Game>[] = curatorGamesDetails
      // Filter games by updatable fields changing
      .filter((gameNew: Partial<Game>) => {
        const gamePrev = oldGames.find(g => g.id === gameNew.id);
        if (!gamePrev) return false; // ignore new games as we already handled them
        return (
          gamePrev.title !== gameNew.title ||
          gamePrev.description !== gameNew.description ||
          gamePrev.tier !== gameNew.tier ||
          gamePrev.sale !== gameNew.sale ||
          gamePrev.achievementsTotal !== gameNew.achievementsTotal
        );
      });

    if (curatorUpdatedGamesDetails.length) {
      log.INFO(
        `--> [UPDATE] main update --> updating ${curatorUpdatedGamesDetails.length} old games [START]`,
      );
      curatorUpdatedGamesDetails.forEach(async game => {
        const responseUpdateOldGame = await collectionGames.updateOne(
          {
            id: game.id,
          },
          {
            $set: {
              title: game.title,
              description: game.description,
              tier: game.tier,
              sale: game.sale,
              achievementsTotal: game.achievementsTotal,
            },
          },
        );
        log.INFO(
          `--> [UPDATE] main update --> updating game ${game.id} [${
            responseUpdateOldGame.acknowledged ? 'SUCCESS' : 'ERROR'
          }]`,
        );

        /**
         * Add events for games.
         */

        curatorUpdatedGamesDetails.forEach(async game => {
          if (!game.id) return;
          const gamePrev = oldGames.find(g => g.id === game.id);
          // Create ACHIEVEMENT NUMBER CHANGE event
          if (gamePrev?.achievementsTotal !== game.achievementsTotal) {
            const collectionEventsAchievementsChange =
              db.collection<Omit<EventAchievementNumberChange, '_id'>>(
                'events',
              );
            await collectionEventsAchievementsChange.insertOne({
              type: EventType.ACHIEVEMENTS_CHANGE,
              gameId: game.id,
              oldNumber: gamePrev?.achievementsTotal ?? 0,
              newNumber: game?.achievementsTotal ?? 0,
              date: new Date(),
            });
          }
          // Create GAME TIER CHANGE event
          // TODO temporarily disabled
          // if (gamePrev?.tier !== game.tier) {
          //   const collectionEventsTierChange =
          //     db.collection<Omit<EventGameTierChange, '_id'>>('events');
          //   await collectionEventsTierChange.insertOne({
          //     type: EventType.GAME_TIER_CHANGE,
          //     gameId: game.id,
          //     oldTier: gamePrev?.tier ?? 'UNKNOWN',
          //     newTier: game?.tier ?? 'UNKNOWN',
          //     date: new Date(),
          //   });
          // }
        });
      });
      log.INFO(
        `--> [UPDATE] main update --> updating ${curatorUpdatedGamesDetails.length} old games [END]`,
      );
    }

    /**
     * Fin!
     */
    await collectionUpdate.updateOne(
      { id: 'status' },
      { $set: { lastUpdate: new Date() } },
    );

    statusCurator.updateProgress = 100;
    statusCurator.updateStatus = UpdateStatus.IDLE;
    statusCurator.isUpdating = false;
    log.INFO(`--> [UPDATE] main update [END]`);
  } catch (err: any) {
    /**
     * Set the update status to error.
     */
    statusCurator.updateProgress = 0;
    statusCurator.updateStatus = UpdateStatus.ERROR;
    statusCurator.isUpdating = false;
    log.INFO(`--> [UPDATE] main update [ERROR]`);
    log.WARN(err.message ?? err);
  }
};

/**
 * Function fetching IDs of current members of curator.
 * @param curatorMembersData string
 */
const getCuratorMemberIds = (curatorMembersData: string) => {
  const idsRegex = new RegExp(/(?<=<steamID64>)(.*)(?=<\/steamID64>)/gim);
  const ids = curatorMembersData.match(idsRegex);
  return ids ?? [];
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
  tiers: Tier[],
) =>
  new Promise(resolve => {
    const curatorGameDetails: Omit<Game, '_id' | 'tier'>[] = [];

    const getDetailedCuratorGamesData = async (gameIndex: number) => {
      log.INFO(`----> [UPDATE] game details ${curatorGames[gameIndex].id}...`);
      statusCurator.updateProgress +=
        (75 * (gameIndex / curatorGames.length)) / 100;
      const details = await getCuratorGameDetails(
        curatorGames[gameIndex],
        tiers,
      );
      curatorGameDetails.push(details);
      if (curatorGames[gameIndex + 1]) {
        setTimeout(
          () => getDetailedCuratorGamesData(gameIndex + 1),
          Number(process.env.DELAY),
        );
      } else {
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
  game: {
    id: string;
    description: string;
  },
  tiers: Tier[],
): Promise<Omit<Game, '_id'>> => {
  const gameId = Number(game.id);
  const curatorGameDetailsUrl = `http://store.steampowered.com/api/appdetails`;
  const curatorGameDetailsData = await axios.get(curatorGameDetailsUrl, {
    params: {
      appids: gameId,
      filters: 'price_overview,basic,achievements',
    },
  });
  const details: SteamGameDetailsData =
    curatorGameDetailsData.data?.[gameId]?.data;
  const finalGame: Omit<Game, '_id'> = {
    id: Number(gameId),
    title: details?.name ?? null,
    description: game.description ?? null,
    achievementsTotal: details?.achievements?.total ?? 0,
    sale: details?.price_overview?.discount_percent ?? 0,
    // @ts-ignore
    tier: getGameTier(game.description, tiers),
    isCurated: true,
    isProtected: false,
  };
  return finalGame;
};

const getGameTier = (description: string, tiers: Tier[]) => {
  const gameTier =
    tiers.find(tier => description.includes(tier.symbol))?.id ?? null;
  return gameTier;
};
