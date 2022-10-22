/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "patrons".
 * A single object describes a single patron.
 */
export interface PatreonTtier extends WithId {
	/**
	 * Steam ID of the patron.
	 */
	memberId: string;
	/**
	 * Patron tier.
	 */
	tier: number;
	/**
	 * Username of the patron (used when a patron is not curator member).
	 */
	username: string | null;
	/**
	 * Link to the avatar of the patron (used when a patron is not curator member).
	 */
	avatar: string | null;
}
