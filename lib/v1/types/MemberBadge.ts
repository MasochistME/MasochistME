/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "memberBadges".
 * A single object describes a single badge belonging to a single member.
 */
export interface MemberBadge extends WithId {
	/**
	 * ID of the badge.
	 */
	badgeId: string;
	/**
	 * Steam ID of the member having that badge.
	 */
	memberId: string;
	/**
	 * Date of unlocking the badge by the member.
	 */
	unlocked: Date;
}
