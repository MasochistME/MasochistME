import { Request, Response } from 'express';
import axios from 'axios';
import {
  Game,
  Member,
  MemberAchievement,
  MemberGame,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { connectToDb } from 'helpers/db';

import {
  MemberSteam,
  MemberSteamGame,
  MemberSteamGameFallback,
  MemberSteamPlayerStats,
} from './types';

import { queueMember } from '.';

/**
 * Updates one particular user data.
 */
export const updateMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { memberId } = req.params;
  try {
    const { client, db } = await connectToDb();
    log.INFO(`--> [UPDATE] user ${memberId} [START]`);

    /**
     * Check if the member update queue is not too long.
     * If yes, do not proceed.
     */
    if (queueMember.QUEUE.length >= queueMember.MAX_UPDATE_QUEUE) {
      res
        .status(202)
        .send('Too many users are updating now - retry in a few minutes.');
      log.INFO(`--> [UPDATE] updating user ${memberId} [QUEUE OVERFLOW]`);
      return;
    }

    /**
     * Check if the member is already in the process of being updated.
     * If yes, do not proceed.
     */
    if (queueMember.QUEUE.includes(memberId)) {
      res.status(202).send('This user is already being updated.');
      log.INFO(`--> [UPDATE] updating user ${memberId} [ALREADY UPDATING]`);
      return;
    }

    /**
     * Check if a member was recently updated.
     * If yes, do not proceed.
     */
    const collectionMembers = db.collection<Member>('members');
    const member = await collectionMembers.findOne({ steamId: memberId });
    if (
      member?.lastUpdated &&
      Date.now() - new Date(member.lastUpdated).getTime() < 3600000
    ) {
      res.status(202).send('This user had been updated less than an hour ago.');
      log.INFO(`--> [UPDATE] user ${memberId} [TOO EARLY]`);
      return;
    }

    /**
     * If user can be updated, send a status update and then continue.
     */
    res.status(202).send('Updating... refresh in a few minutes');
    queueMember.QUEUE = [...queueMember.QUEUE, memberId];

    /**
     * Get member's data from Steam API.
     */
    log.INFO(`--> [UPDATE] user ${memberId} --> fetching Steam data...`);
    const memberSteamUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2`;
    const memberSteamData = await axios.get(memberSteamUrl, {
      params: {
        key: process.env.STEAM_KEY,
        steamids: memberId,
      },
    });
    const memberSteam: MemberSteam | undefined =
      memberSteamData?.data?.response?.players?.[0];

    if (!memberSteam) {
      throw new Error('Cannot update, retry in a few minutes');
    }

    /**
     * Try to update the most basic member info.
     */
    const responseUpdateMemberBasic = await collectionMembers.updateOne(
      { steamId: memberId },
      {
        $set: {
          name: memberSteam.personaname,
          avatar: memberSteam.avatar,
          isPrivate: memberSteam.communityvisibilitystate === 3,
          lastUpdated: new Date(0), // this is temp
          // lastUpdated: new Date(),
          // isMember: member?.isMember, // TODO this needs to be updated later with curator data
        },
      },
    );
    if (!responseUpdateMemberBasic.acknowledged) {
      throw new Error(`Could not update member's basic data.`);
    }

    /**
     * Get cursors for all relevant collections.
     */
    log.INFO(`--> [UPDATE] user ${memberId} --> fetching current data...`);
    const collectionMemberGames = db.collection<MemberGame>('memberGames');
    const collectionGames = db.collection<Game>('games');
    const collectionMemberAchievements =
      db.collection<MemberAchievement>('memberAchievements');

    const gamesCursor = await collectionGames.find();
    const memberGamesCursor = await collectionMemberGames.find({ memberId });
    const memberAchievementsCursor = await collectionMemberAchievements.find({
      memberId,
    });

    /**
     * Prepare arrays for all the collections.
     */
    const games: Game[] = [];
    const oldMemberGames: MemberGame[] = [];
    const oldMemberAchievements: MemberAchievement[] = [];

    /**
     * Iterate through all the cursors.
     */
    await gamesCursor.forEach((el: Game) => {
      games.push(el);
    });
    await memberGamesCursor.forEach((el: MemberGame) => {
      oldMemberGames.push(el);
    });
    await memberAchievementsCursor.forEach((el: MemberAchievement) => {
      oldMemberAchievements.push(el);
    });

    /**
     * Get info about member's Curator games.
     * If the first endpoint fails, use a fallback one.
     */
    let memberSteamGames = await getMemberSteamGames(memberId, games);
    if (!memberSteamGames)
      memberSteamGames = await getMemberSteamGamesFallback(memberId, games);

    /**
     * Get info about member's achievements.
     * Achievements also give us info about game's completion ratio.
     */
    const memberSteamAchievements = await getMemberSteamAchievements(
      memberId,
      memberSteamGames,
    );

    /**
     * Aggregate the Steam game data with its achievement data.
     * This allows us to populate both MemberGames and MemberAchievements databases.
     */
    const memberGames: Omit<MemberGame, '_id'>[] = memberSteamGames.map(
      game => {
        const gameStats = memberSteamAchievements.find(
          g => g.gameId === game.gameId,
        );
        return {
          ...game,
          completionPercentage: gameStats?.game.completionPercentage ?? 0,
          mostRecentAchievementDate:
            gameStats?.game.mostRecentAchievementDate ?? new Date(0),
        };
      },
    );
    const finalMemberData = {
      memberGames,
      memberAchievements: memberSteamAchievements
        .map(mA => mA.achievements)
        .flat(),
    };

    /**
     * Now compare that with what we have in the database
     * and if needed, upsert it.
     */
    console.log(finalMemberData);

    /**
     * Add event when member completed a new game.
     */
    console.log('TODO');

    /**
     * Fin!
     */
    client.close();
    log.INFO(`--> [UPDATE] user ${memberId} [END]`);
  } catch (err: any) {
    log.INFO(`--> [UPDATE] user ${memberId} [ERROR]`);
    log.WARN(err.message ?? err);
    /**
     * Remove user from update queue.
     */
    queueMember.QUEUE = queueMember.QUEUE.filter(queue => queue !== memberId);
  }
};

/**
 * Get member's games from the proper Steam API endpoint.
 */
const getMemberSteamGames = async (memberId: string, curatedGames: Game[]) => {
  log.INFO(`--> [UPDATE] user ${memberId} --> fetching games data...`);
  const memberSteamUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`;
  const memberSteamGamesData = await axios.get(memberSteamUrl, {
    params: {
      key: process.env.STEAM_KEY,
      steamid: memberId,
      include_played_free_games: true,
    },
  });
  const memberSteamGames: MemberSteamGame[] =
    memberSteamGamesData?.data?.response?.games;
  if (!memberSteamGames) return null;

  const memberSteamGamesFixed = memberSteamGames
    .filter(game => {
      const isCurated = curatedGames.find(g => g.id === game.appid);
      return !!isCurated;
    })
    .map(game => ({
      memberId,
      gameId: game.appid,
      playTime: game.playtime_forever / 60, // this is in minutes
    }));

  return memberSteamGamesFixed;
};

/**
 * This is a fallback function - it will execute when getNewMemberGames does not return any data.
 * You should avoid using it as it scrapes Steam's HTML page and has potential to break.
 */
const getMemberSteamGamesFallback = async (
  memberId: string,
  curatedGames: Game[],
) => {
  log.INFO(
    `--> [UPDATE] user ${memberId} --> fetching games data - fallback...`,
  );
  /**
   * Scrapping member's Steam profile page.
   */
  const memberScrappedProfileUrl = `https://steamcommunity.com/profiles/${memberId}/games/?tab=all`;
  const memberScrappedProfileData =
    (await axios.get(memberScrappedProfileUrl)).data ?? '';
  const profileRegex = new RegExp(/(?<=var rgGames = )(.*)(?=[}}])/i);
  const memberScrappedProfileranslated =
    profileRegex.exec(memberScrappedProfileData)?.[0] + '}]' ?? '{}';
  const memberScrappedProfileParsed: MemberSteamGameFallback[] = JSON.parse(
    memberScrappedProfileranslated,
  );
  const memberScrappedProfileFixed = memberScrappedProfileParsed
    .filter(game => {
      const isCurated = curatedGames.find(g => g.id === game.appid);
      return !!isCurated;
    })
    .map(game => ({
      memberId,
      gameId: game.appid,
      playTime: game.hours_forever ? Number(game.hours_forever) : 0, // this is in hours
    }));
  return memberScrappedProfileFixed;
};

/**
 * Get member's achievements from all their curated games.
 */
type TempMemberStats = {
  memberId: string;
  gameId: number;
  achievements: Pick<MemberAchievement, 'achievementName' | 'unlockTime'>[];
  game: Pick<MemberGame, 'completionPercentage' | 'mostRecentAchievementDate'>;
};
const getMemberSteamAchievements = async (
  memberId: string,
  memberGames: { gameId: number; playTime: number }[],
): Promise<TempMemberStats[]> =>
  new Promise(resolve => {
    log.INFO(`--> [UPDATE] achievements for member ${memberId} [START]`);
    const memberAchievements: TempMemberStats[] = [];

    const getRecurrentAchievementData = async (gameIndex: number) => {
      const game = memberGames[gameIndex];
      log.INFO(`---> [UPDATE] achievements for game ${game.gameId}...`);
      const memberPlayerStatsUrl = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1`;
      const memberPlayerStatsData: MemberSteamPlayerStats =
        (
          await axios.get(memberPlayerStatsUrl, {
            params: {
              key: process.env.STEAM_KEY,
              steamid: memberId,
              appid: game.gameId,
              format: 'json',
            },
          })
        )?.data ?? [];
      /**
       * Get an object with all achievements from the specified game
       * that the requested member had already completed.
       */
      const memberAchievementsMap: Pick<
        MemberAchievement,
        'achievementName' | 'unlockTime'
      >[] = memberPlayerStatsData.playerstats.achievements
        .filter(achievement => achievement.achieved === 1)
        .map(achievement => ({
          memberId,
          gameId: game.gameId,
          achievementName: achievement.apiname,
          unlockTime: new Date(achievement.unlocktime * 1000),
        }));
      /**
       * Using achievements data, calculate the game's completion percentage
       * as well as get the date of the game's completion
       * (so when user unlocked the last achievement).
       */
      const completionPercentage =
        100 *
        ((memberAchievementsMap.length ?? 0) /
          (memberPlayerStatsData.playerstats.achievements.length ?? 0));

      let mostRecentAchievementDate = 0;
      memberAchievementsMap.forEach(achievement =>
        achievement.unlockTime.getTime() > mostRecentAchievementDate
          ? (mostRecentAchievementDate = achievement.unlockTime.getTime())
          : null,
      );
      /**
       * Create an object which aggregated the game achievements'
       * and game completion data.
       */
      memberAchievements.push({
        memberId,
        gameId: game.gameId,
        achievements: memberAchievementsMap,
        game: {
          completionPercentage,
          mostRecentAchievementDate: new Date(mostRecentAchievementDate),
        },
      });
      if (gameIndex < 3) {
        // TODO // This is temp, change to:
        // if (memberGames[gameIndex + 1]) {
        setTimeout(
          () => getRecurrentAchievementData(gameIndex + 1),
          Number(process.env.DELAY),
        );
      } else {
        log.INFO(`--> [UPDATE] achievements for member ${memberId} [DONE]`);
        resolve(memberAchievements);
      }
    };

    getRecurrentAchievementData(0);
  });
