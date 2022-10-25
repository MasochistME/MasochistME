/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * Map of the patron tiers.
 */
export enum PatronTier {
	TIER1 = '5D',
	TIER2 = '10D',
	TIER3 = '20D',
	TIER4 = '50D',
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
	 * Position of the tier (higher pledge = higher tier)
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
