/**
 * @module Tiers
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "tiers".
 * A single object describes a single tier.
 */
export interface Tier extends WithId {
	/**
	 * Unicode symbol of a tier (for example 🌟).
	 */
	symbol: string;
	/**
	 * A FontAwesome icon classname (for example `fas fa-star`).
	 */
	icon: string;
	/**
	 * Numeric point value of a tier.
	 */
	score: number;
	/**
	 * Short description, displayed on a website.
	 */
	description: string;
	/**
	 * ID of a tier, usually a stringified number from 1 to 5.
	 */
	id: TierId;
}

/**
 * TODO this is temp
 */
export type TierId = '1' | '2' | '3' | '4' | '5';
