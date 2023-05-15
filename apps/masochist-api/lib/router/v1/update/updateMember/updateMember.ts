import { Request, Response } from 'express';
import axios from 'axios';
import {
  Game,
  Member,
  MemberAchievement,
  MemberGame,
  LogType,
  LogComplete,
} from '@masochistme/sdk/dist/v1/types';

import { log } from 'helpers/log';
import { mongoInstance } from 'api';

import {
  MemberSteam,
  MemberSteamGame,
  MemberSteamGameFallback,
  MemberSteamPlayerStats,
} from '../types';

import { updateQueue } from '../updateQueue';

/**
 * Updates one particular user data.
 */
export const updateMember = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { memberId } = req.params;
  const { db } = mongoInstance.getDb();
  try {
    log.INFO(`--> [UPDATE] user ${memberId} [START]`);
    const collectionMembers = db.collection<Member>('members');
    const member = await collectionMembers.findOne({ steamId: memberId });

    if (!member?.isMember && !member?.isProtected) {
      res.status(202).send({
        message:
          'This user cannot be updated as they are not a member of curator.',
      });
      log.INFO(`--> [UPDATE] updating user ${memberId} [NOT A MEMBER]`);
      return;
    }

    /**
     * Check if the member update queue is not too long.
     * If yes, do not proceed.
     */
    if (updateQueue.isMemberQueueFull()) {
      res.status(202).send({
        message: 'Too many users are updating now - retry in a few minutes.',
      });
      log.INFO(`--> [UPDATE] updating user ${memberId} [QUEUE OVERFLOW]`);
      return;
    }

    /**
     * Check if the member is already in the process of being updated.
     * If yes, do not proceed.
     */
    if (updateQueue.MEMBER_QUEUE.includes(memberId)) {
      res.status(202).send({ message: 'This user is already being updated.' });
      log.INFO(`--> [UPDATE] updating user ${memberId} [ALREADY UPDATING]`);
      return;
    }

    /**
     * Check if a member was recently updated.
     * If yes, do not proceed (unless it's dev environment).
     */
    if (
      process.env.ENV !== 'dev' &&
      member?.lastUpdated &&
      Date.now() - new Date(member.lastUpdated).getTime() < 3600000
    ) {
      res
        .status(202)
        .send({ message: 'This user had been updated less than an hour ago.' });
      log.INFO(`--> [UPDATE] user ${memberId} [TOO EARLY]`);
      return;
    }

    /**
     * If user can be updated, send a status update and then continue.
     */
    res.status(202).send({
      message:
        'Member update successfully started! Refresh in a couple of minutes.',
    });
    updateQueue.MEMBER_QUEUE = [...updateQueue.MEMBER_QUEUE, memberId];

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
     * Get a list of current curator games to compare with member's game list.
     */
    const collectionGames = db.collection<Game>('games');
    const gamesCursor = await collectionGames.find();
    const games: Game[] = [];

    await gamesCursor.forEach((el: Game) => {
      games.push(el);
    });

    /**
     * Get info about member's Curator games.
     * If the first endpoint fails, use a fallback one.
     */
    let newMemberSteamGames = await getMemberSteamGames(memberId, games);
    if (!newMemberSteamGames?.length)
      newMemberSteamGames = await getMemberSteamGamesFallback(memberId, games);

    // Add family share games to the list
    const recentMemberSteamGames = await getMemberRecentSteamGames(
      memberId,
      games,
    );
    recentMemberSteamGames.forEach(game => {
      const hasGame = newMemberSteamGames.find(g => g.gameId === game.gameId);
      if (!hasGame) newMemberSteamGames.push(game);
    });

    if (!newMemberSteamGames.length) {
      log.INFO(
        `--> [UPDATE] user ${memberId} --> game list is empty, check if the user does not have private game list...`,
      );
    }

    /**
     * Get info about member's achievements.
     * Achievements also give us info about game's completion ratio.
     */
    const newMemberSteamAchievements = await getMemberSteamAchievements(
      memberId,
      newMemberSteamGames,
    );

    /**
     * Aggregate the Steam game data with its achievement data.
     * This allows us to populate both MemberGames and MemberAchievements databases.
     */
    const memberGames: Omit<MemberGame, '_id'>[] = newMemberSteamGames.map(
      game => {
        const gameStats = newMemberSteamAchievements.find(
          g => g.gameId === game.gameId,
        );
        const {
          completionPercentage = 0,
          achievementsUnlocked = 0,
          mostRecentAchievementDate = new Date(0),
        } = gameStats?.game ?? {};

        return {
          ...game,
          completionPercentage,
          achievementsUnlocked,
          mostRecentAchievementDate,
        };
      },
    );

    /**
     * We will now compare that with what we have in the database
     * and if needed, upsert it.
     */
    log.INFO(
      `--> [UPDATE] user ${memberId} --> injecting updated data into database...`,
    );

    const finalMemberData = {
      memberGames,
      memberAchievements: newMemberSteamAchievements
        .map(mA => mA.achievements)
        .flat(),
    };

    /**
     * Update member games in the database.
     */
    const collectionMemberGames = db.collection<MemberGame>('memberGames');
    const memberGamesCursor = await collectionMemberGames.find({ memberId });
    const oldMemberGames: MemberGame[] = [];
    await memberGamesCursor.forEach((el: MemberGame) => {
      oldMemberGames.push(el);
    });

    const memberGamesToUpdate = finalMemberData.memberGames.filter(
      (memberGame: Omit<MemberGame, '_id'>) => {
        const memberGameOld = oldMemberGames.find(
          old =>
            old.gameId === memberGame.gameId &&
            old.memberId === memberGame.memberId,
        );
        if (!memberGameOld) {
          // This game is not registered in DB - add it
          return true;
        }
        if (
          // we use "lesser than" instead of "not equal", since Steam API sometimes breaks
          // and returns 0 for all those values.
          // If we check inequality instead of lesser than, the old values get reset.
          memberGameOld.achievementsUnlocked <
            memberGame.achievementsUnlocked ||
          // this is an exception for now because some members need to have their hours divided by 10
          // when the entire database gets updated then it can go back to lesser than
          (memberGame.playTime !== 0 &&
            memberGameOld.playTime !== memberGame.playTime) ||
          memberGameOld.mostRecentAchievementDate.getTime() <
            memberGame.mostRecentAchievementDate.getTime()
        ) {
          // This game is registered in DB and changed - proceed
          return true;
        }
        // This game is registered in DB and nothing changed - ignore
        return false;
      },
    );

    memberGamesToUpdate.forEach(async memberGame => {
      await collectionMemberGames.updateOne(
        { memberId: memberGame.memberId, gameId: memberGame.gameId },
        { $set: memberGame },
        { upsert: true },
      );
    });

    /**
     * Update member achievements in the database.
     */
    const collectionMemberAchievements =
      db.collection<MemberAchievement>('memberAchievements');
    const memberAchievementsCursor = await collectionMemberAchievements.find({
      memberId,
    });
    const oldMemberAchievements: MemberAchievement[] = [];
    await memberAchievementsCursor.forEach((el: MemberAchievement) => {
      oldMemberAchievements.push(el);
    });

    const memberAchievementsToUpdate =
      finalMemberData.memberAchievements.filter(
        (memberAchievement: Omit<MemberAchievement, '_id'>) => {
          const memberAchievementOld = oldMemberAchievements.find(
            old =>
              old.gameId === memberAchievement.gameId &&
              old.memberId === memberAchievement.memberId,
          );
          // This achievement is not registered in DB - add it
          if (!memberAchievementOld) return true;
          // This game is registered in DB - continue with no changes
          return false;
        },
      );

    memberAchievementsToUpdate.forEach(async memberAchievement => {
      await collectionMemberAchievements.updateOne(
        {
          memberId: memberAchievement.memberId,
          gameId: memberAchievement.gameId,
        },
        { $set: memberAchievement },
        { upsert: true },
      );
    });

    /**
     * Add log when member completed a new game.
     */
    const newlyCompletedGames = memberGamesToUpdate.filter(
      game => game.completionPercentage === 100,
    );
    if (newlyCompletedGames.length) {
      const collectionLogs = db.collection<Omit<LogComplete, '_id'>>('logs');
      newlyCompletedGames.forEach(async newCompletion => {
        log.INFO(
          `--> [UPDATE] user ${memberId} --> hundo detected - ${newCompletion.gameId}`,
        );
        // This is a bit complicated - a hacky way to ensure that hundos are not re-logged
        // every time something else changes in the newCompletion object, for example playtime.
        await collectionLogs.updateOne(
          {
            type: LogType.COMPLETE,
            memberId: newCompletion.memberId,
            gameId: newCompletion.gameId,
            date: newCompletion.mostRecentAchievementDate,
          },
          {
            $set: {
              type: LogType.COMPLETE,
              memberId: newCompletion.memberId,
              gameId: newCompletion.gameId,
              date: newCompletion.mostRecentAchievementDate,
            },
          },
          { upsert: true },
        );
      });
    }

    /**
     * Try to update the most basic member info.
     * We leave it for the very last so the lastUpdated date gets bumped
     * only when the entire update actually goes through.
     */
    const responseUpdateMemberBasic = await collectionMembers.updateOne(
      { steamId: memberId },
      {
        $set: {
          name: memberSteam.personaname,
          avatar: memberSteam.avatar,
          avatarHash: memberSteam.avatarhash,
          isPrivate: memberSteam.communityvisibilitystate === 1,
          lastUpdated: new Date(),
        },
      },
    );
    if (!responseUpdateMemberBasic.acknowledged) {
      throw new Error(`Could not update member's basic data.`);
    }

    /**
     * Fin!
     */
    updateQueue.MEMBER_QUEUE = updateQueue.MEMBER_QUEUE.filter(
      queue => queue !== memberId,
    );
    log.INFO(`--> [UPDATE] user ${memberId} [END]`);
  } catch (err: any) {
    log.INFO(`--> [UPDATE] user ${memberId} [ERROR]`);
    log.WARN(err.message ?? err);
    /**
     * Remove user from update queue.
     */
    updateQueue.MEMBER_QUEUE = updateQueue.MEMBER_QUEUE.filter(
      queue => queue !== memberId,
    );
  } finally {
    //
  }
};

export const getMemberSteamGames = async (
  memberId: string,
  curatedGames: Game[],
) => {
  log.INFO(`--> [UPDATE] user ${memberId} --> fetching games data...`);
  const memberSteamUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`;
  const memberSteamGamesData = await axios.get(memberSteamUrl, {
    params: {
      key: process.env.STEAM_KEY,
      steamid: memberId,
      include_played_free_games: true,
      include_free_sub: true,
      skip_unvetted_apps: false,
    },
  });
  const memberSteamGames: MemberSteamGame[] =
    memberSteamGamesData?.data?.response?.games;
  if (!memberSteamGames) return [];

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
 * Get member's games from scrapping the Steam page.
 * This is a fallback function - it will execute when getNewMemberGames does not return any data.
 * Steam has hid this endpoint behind a login, so it is left here as a fallback.
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
    (await axios.get(memberScrappedProfileUrl)).data ?? '{}';
  const profileRegex = new RegExp(/(?<=var rgGames = )(.*)(?=[}}])/i);
  // this can return undefined, if user privated only their game list
  const memberScrappedProfileMatched = profileRegex.exec(
    memberScrappedProfileData,
  )?.[0];
  const memberScrappedProfileTranslated = memberScrappedProfileMatched
    ? memberScrappedProfileMatched + '}]'
    : '[]';

  const memberScrappedProfileParsed: MemberSteamGameFallback[] = JSON.parse(
    memberScrappedProfileTranslated,
  );
  const memberScrappedProfileFixed = memberScrappedProfileParsed
    .filter(game => {
      const isCurated = curatedGames.find(g => g.id === game.appid);
      return !!isCurated;
    })
    .map(game => {
      // this is in hours
      // hours_forever is string which inserts comma when in thousands
      // it also inserts dot when there's a fraction of an hour, but this can stay
      const playtimeHours = (game?.hours_forever ?? '0').replace(',', '');
      const playTime = !Number.isNaN(Number(playtimeHours))
        ? Number(playtimeHours)
        : 0;
      return {
        memberId,
        gameId: game.appid,
        playTime,
      };
    });
  return memberScrappedProfileFixed;
};

/**
 * Get member's recent games from scrapping the Steam page.
 * The reason this is used before the proper endpoint is that it shows
 * family share games as well, if they were played in the last 2 weeks.
 */
const getMemberRecentSteamGames = async (
  memberId: string,
  curatedGames: Game[],
) => {
  log.INFO(`--> [UPDATE] user ${memberId} --> fetching recent games data...`);
  /**
   * Scrapping member's Steam profile page - recent tab.
   */
  const memberScrappedProfileUrl = `https://steamcommunity.com/profiles/${memberId}/games/?tab=recent`;
  const memberScrappedProfileData =
    (await axios.get(memberScrappedProfileUrl)).data ?? '{}';
  const profileRegex = new RegExp(/(?<=var rgGames = )(.*)(?=[}}])/i);
  // this can return undefined, if user privated only their game list
  const memberScrappedProfileMatched = profileRegex.exec(
    memberScrappedProfileData,
  )?.[0];
  const memberScrappedProfileTranslated = memberScrappedProfileMatched
    ? memberScrappedProfileMatched + '}]'
    : '[]';

  const memberScrappedProfileParsed: MemberSteamGameFallback[] = JSON.parse(
    memberScrappedProfileTranslated,
  );
  const memberScrappedProfileFixed = memberScrappedProfileParsed
    .filter(game => {
      const isCurated = curatedGames.find(g => g.id === game.appid);
      return !!isCurated;
    })
    .map(game => {
      // this is in hours
      // hours_forever is string which inserts comma when in thousands
      // it also inserts dot when there's a fraction of an hour, but this can stay
      const playtimeHours = (game?.hours_forever ?? '0').replace(',', '');
      const playTime = !Number.isNaN(Number(playtimeHours))
        ? Number(playtimeHours)
        : 0;
      return {
        memberId,
        gameId: game.appid,
        playTime,
      };
    });
  return memberScrappedProfileFixed;
};

/**
 * Get member's achievements from all their curated games.
 */
type TempMemberStats = {
  memberId: string;
  gameId: number;
  achievements: Omit<MemberAchievement, '_id'>[];
  game: Pick<
    MemberGame,
    | 'completionPercentage'
    | 'mostRecentAchievementDate'
    | 'achievementsUnlocked'
  >;
};
export const getMemberSteamAchievements = async (
  memberId: string,
  memberGames: { gameId: number; playTime: number }[],
): Promise<TempMemberStats[]> =>
  new Promise(resolve => {
    log.INFO(`--> [UPDATE] achievements for member ${memberId} [START]`);
    const memberAchievements: TempMemberStats[] = [];

    const getRecurrentAchievementData = async (gameIndex: number) => {
      try {
        const game = memberGames[gameIndex];
        if (!game) return resolve(memberAchievements);
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
        const memberAchievementsMap: Omit<MemberAchievement, '_id'>[] = (
          memberPlayerStatsData.playerstats?.achievements ?? []
        )
          .filter(achievement => achievement.achieved === 1)
          .map(achievement => ({
            memberId,
            gameId: game.gameId,
            achievementName: achievement.apiname,
            unlockTime: new Date(achievement.unlocktime * 1000),
          }));
        const achievementsUnlocked = memberAchievementsMap?.length ?? 0;
        /**
         * @deprecated completionPercentage should not be used! Use achievementsUnlocked instead
         * Using achievements data, calculate the game's completion percentage
         * as well as get the date of the game's completion
         * (so when user unlocked the last achievement).
         */
        const completionPercentage =
          (100 * achievementsUnlocked) /
          (memberPlayerStatsData?.playerstats?.achievements?.length ?? 0);

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
            achievementsUnlocked,
            mostRecentAchievementDate: new Date(mostRecentAchievementDate),
          },
        });
        if (memberGames[gameIndex + 1]) {
          setTimeout(
            () => getRecurrentAchievementData(gameIndex + 1),
            Number(process.env.DELAY),
          );
        } else {
          log.INFO(`--> [UPDATE] achievements for member ${memberId} [DONE]`);
          resolve(memberAchievements);
        }
      } catch (err: any) {
        /**
         * Axios request fails when the game has no achievements.
         * Here we ignore that error and procees.
         */
        log.WARN(err.message ?? err);
        if (memberGames[gameIndex + 1]) {
          setTimeout(
            () => getRecurrentAchievementData(gameIndex + 1),
            Number(process.env.DELAY),
          );
        } else {
          log.INFO(`--> [UPDATE] achievements for member ${memberId} [DONE]`);
          resolve(memberAchievements);
        }
      }
    };

    getRecurrentAchievementData(0);
  });
