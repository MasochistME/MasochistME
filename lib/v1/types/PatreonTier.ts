/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * Map of the patron tiers.
 */
export enum PatronTier {
	TIER1 = '1',
	TIER2 = '2',
	TIER3 = '3',
	TIER4 = '4',
}

/**
 * This is a type of a single object within the collection "patrons".
 * A single object describes a single patron.
 */
export interface PatreonTier extends WithId {
	/**
	 * Steam ID of the patron.
	 */
	memberId: string;
	/**
	 * Patron tier.
	 */
	tier: PatronTier;
	/**
	 * Username of the patron (used when a patron is not curator member).
	 */
	username: string | null;
	/**
	 * Link to the avatar of the patron (used when a patron is not curator member).
	 */
	avatar: string | null;
}
