/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * Map of the patron tiers.
 */
export enum PatronTier {
	TIER1 = '50D',
	TIER2 = '20D',
	TIER3 = '10D',
	TIER4 = '5D',
}

/**
 * This is a type of a single object within the collection "patrons".
 * A single object describes a single patron.
 */
export interface PatreonTier extends WithId {
	/**
	 * ID of the Patreon tier.
	 */
	id: PatronTier;
	/**
	 * Position of the tier (higher pledge = lower tier. Position 1 is the highest)
	 */
	tier: number;
	/**
	 * A Font Awesome icon representing the Patreon tier.
	 */
	symbol: string;
	/**
	 * Short and concise description of the Patreon tier.
	 */
	description: string;
	/**
	 * Basic color of the Patreon tier.
	 */
	color: string;
}
