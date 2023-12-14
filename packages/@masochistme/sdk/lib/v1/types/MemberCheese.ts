/**
 * @module Members
 */

import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "memberBadges".
 * A single object describes a single badge belonging to a single member.
 */
export type MemberCheese = WithId<{
  /**
   * Steam ID of the member having that badge.
   */
  memberId: string;
  /**
   * ID of the cheesed game.
   */
  gameId: number;
  /**
   * Determines if the cheese badge was self-added or by a mod.
   * If by a mod, member cannot edit it.
   */
  isModAssigned: boolean;
  /**
   * Selectable reason for self-assigning a cheese badge. Will be empty string if none provided.
   */
  reason: string;
  /**
   * Negative value of the cheese badge.
   */
  points: number;
  /**
   * Date of unlocking the badge by the member.
   */
  unlocked: Date;
}>;
