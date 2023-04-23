/**
 * @module Members
 */
import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "memberAwards".
 * A single object describes a single award unlocked by a single member.
 */
export interface MemberAward extends WithId {
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
}
