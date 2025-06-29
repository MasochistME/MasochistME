/**
 * @module Members
 */
import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "memberAchievements".
 * A single object describes a single achievement unlocked by a single member.
 */
export type MemberAchievement = WithId<{
  /**
   * Steam ID of the member who unlocked that achievement.
   */
  memberId: string;
  /**
   * Steam ID of the game having that achievement.
   */
  gameId: number;
  /**
   * Steam's API name of the achievement.
   */
  achievementName: string;
  /**
   * Date of member unlocking that particular achievement.
   */
  unlockTime: Date;
}>;
