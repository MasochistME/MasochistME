/**
 * @module Seasons
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection seasons.
 * A single object describes a single race season.
 */
export interface Season extends WithId {
	/**
	 * Name of the season.
	 */
	name: string;
	/**
	 * Description of the season.
	 */
	description: string;
	/**
	 * URL of the season's icon.
	 */
	icon: string;
	/**
	 * If the season has started, the date of starting is stored in this field.
	 */
	startDate: Date | null;
	/**
	 * If the season has ended, the date of ending is stored in this field.
	 */
	endDate: Date | null;
	/**
	 * Indicates if this is a special season.
	 */
	isSpecial: boolean;
}

export interface SeasonLeaderboardEntry {
	/**
	 * ID of the race belonging to the season
	 */
	raceId: string;
	/**
	 * ID of a participant in that race
	 */
	discordId: string;
	/**
	 * Points that participant earned for this particular race
	 */
	points: number;
	/**
	 * DNF of participant in that race
	 */
	dnf: boolean;
	/**
	 * Disqualification of participant in that race
	 */
	disqualified: boolean;
}
