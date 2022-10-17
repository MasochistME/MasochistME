/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "patrons".
 * A single object describes a single patron.
 */
export interface Patron extends WithId {
	/**
	 * Steam ID of the patron.
	 */
	steamId: string;
	/**
	 * Patron tier.
	 */
	tier: number;
}
