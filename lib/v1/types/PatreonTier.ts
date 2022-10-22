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
	 * ID of the Patreon tier.
	 */
	tier: PatronTier;
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
