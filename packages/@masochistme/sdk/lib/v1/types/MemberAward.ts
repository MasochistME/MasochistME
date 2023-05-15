/**
 * @module Members
 */
import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "memberAwards".
 * A single object describes a single award unlocked by a single member.
 */
export type MemberAward = WithId<{
  /**
   * ID of the award.
   */
  awardId: string;
  /**
   * Steam ID of the member having that award.
   */
  memberId: string;
  /**
   * Date of unlocking the award by the member.
   */
  unlocked: Date;
}>;
