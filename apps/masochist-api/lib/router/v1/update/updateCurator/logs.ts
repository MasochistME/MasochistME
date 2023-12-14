import {
  Game,
  LogAchievementNumberChange,
  LogGameAdd,
  LogGameRemove,
  LogGameTierChange,
  LogMemberJoin,
  LogMemberLeave,
  LogType,
} from '@masochistme/sdk/dist/v1/types';
import { mongoInstance } from 'api';
import { log } from 'helpers/log';

const logLogger = (type: string, logId: unknown, ack: boolean) => {
  log.INFO(
    `--> [UPDATE] main update --> ${type} log ${logId} [${
      ack ? 'SUCCESS' : 'ERROR'
    }]`,
  );
};

/**
 * Log for MEMBER_JOIN
 */
export const logMemberJoin = async (membersWhoJoined: string[]) => {
  const { db } = mongoInstance.getDb();

  const collectionLogsMemberJoin =
    db.collection<Omit<LogMemberJoin, '_id'>>('logs');

  membersWhoJoined.forEach(async memberId => {
    const responseLog = await collectionLogsMemberJoin.insertOne({
      type: LogType.MEMBER_JOIN,
      memberId,
      date: new Date(),
    });

    logLogger('MEMBER_JOIN', memberId, responseLog.acknowledged);
  });
};

/**
 * Log for MEMBER_LEAVE
 */
export const logMemberLeave = async (membersWhoLeft: string[]) => {
  const { db } = mongoInstance.getDb();

  const collectionLogsMemberLeave =
    db.collection<Omit<LogMemberLeave, '_id'>>('logs');

  membersWhoLeft.forEach(async memberId => {
    const responseLog = await collectionLogsMemberLeave.insertOne({
      type: LogType.MEMBER_LEAVE,
      memberId,
      date: new Date(),
    });

    logLogger('MEMBER_LEAVE', memberId, responseLog.acknowledged);
  });
};

/**
 * Log for GAME_ADD
 */
export const logGameAdd = async (gamesThatGotAdded: number[]) => {
  const { db } = mongoInstance.getDb();

  const collectionLogsGamesAdd = db.collection<Omit<LogGameAdd, '_id'>>('logs');

  gamesThatGotAdded.forEach(async gameId => {
    const responseLog = await collectionLogsGamesAdd.insertOne({
      type: LogType.GAME_ADD,
      gameId,
      date: new Date(),
    });

    logLogger('GAME_ADD', gameId, responseLog.acknowledged);
  });
};

/**
 * Log for GAME_REMOVE
 */
export const logGameRemove = async (gamesThatGotRemoved: number[]) => {
  const { db } = mongoInstance.getDb();

  const collectionLogsGamesRemoved =
    db.collection<Omit<LogGameRemove, '_id'>>('logs');

  gamesThatGotRemoved.forEach(async gameId => {
    const responseLog = await collectionLogsGamesRemoved.insertOne({
      type: LogType.GAME_REMOVE,
      gameId,
      date: new Date(),
    });

    logLogger('GAME_REMOVE', gameId, responseLog.acknowledged);
  });
};

/**
 * Log for ACHIEVEMENTS_CHANGE
 */
export const logAchievementNumberChange = async (
  gamePrev: Game | undefined,
  gameNew: Partial<Game>,
) => {
  const { db } = mongoInstance.getDb();

  if (!gameNew.id) return;
  if (gamePrev?.achievementsTotal === gameNew.achievementsTotal) return; // No change, no log

  const collectionLogsAchievementsChange =
    db.collection<Omit<LogAchievementNumberChange, '_id'>>('logs');
  const responseLog = await collectionLogsAchievementsChange.insertOne({
    type: LogType.ACHIEVEMENTS_CHANGE,
    gameId: gameNew.id,
    oldNumber: gamePrev?.achievementsTotal ?? 0,
    newNumber: gameNew?.achievementsTotal ?? 0,
    date: new Date(),
  });

  logLogger('ACHIEVEMENTS_CHANGE', gameNew.id, responseLog.acknowledged);
};

/**
 * Log for GAME_TIER_CHANGE
 */
export const logGameTierChange = async (
  gamePrev: Game | undefined,
  gameNew: Partial<Game>,
) => {
  const { db } = mongoInstance.getDb();

  if (!gameNew.id) return;
  if (gamePrev?.tier === gameNew.tier) return; // No change, no log

  const collectionLogsTierChange =
    db.collection<Omit<LogGameTierChange, '_id'>>('logs');
  const responseLog = await collectionLogsTierChange.insertOne({
    type: LogType.GAME_TIER_CHANGE,
    gameId: gameNew.id,
    oldTier: gamePrev?.tier ?? 'UNKNOWN',
    newTier: gameNew?.tier ?? 'UNKNOWN',
    date: new Date(),
  });

  logLogger('GAME_TIER_CHANGE', gameNew.id, responseLog.acknowledged);
};
