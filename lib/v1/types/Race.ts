/**
 * @module Races
 */

import { WithId } from 'v1/types/__Helpers';

export enum RaceType {
	TIME_BASED = 'time',
	SCORE_BASED = 'score',
}

/**
 * Fields which are common for all types of races.
 */
interface BaseRace extends WithId {
	/**
	 * Name of the race.
	 */
	name: string;
	/**
	 * Part of the instructions visible to all members before starting a race.
	 */
	instructions: string;
	/**
	 * Part of the instruction visible only to members who started a race.
	 */
	objectives: string;
	/**
	 * Type of the race
	 */
	type: keyof typeof RaceType;
	/**
	 * Date of starting the race.
	 */
	startDate: Date;
	/**
	 * Date of ending the race.
	 */
	endDate: Date;
	/**
	 * URL to the game's website.
	 */
	downloadLink: string;
	/**
	 * Time to download the game [seconds].
	 */
	downloadGrace: number;
	/**
	 * Time to upload a proof of finishing the game [seconds].
	 */
	uploadGrace: number;
	/**
	 * Discord ID of the race's organizer.
	 */
	organizer: string;
	/**
	 * Flag indicating if the race is currently ongoing.
	 */
	isActive: boolean;
	/**
	 * ID of the season that this race belongs to (if null, it's a special non-seasoned race).
	 */
	season: string | null;
	/**
	 * URL of the race's icon.
	 */
	icon?: string;
}

/**
 * Race which is score based - members need to get the highest score possible within a time limit.
 */
export interface RaceScoreBased extends Omit<BaseRace, 'type'> {
	/**
	 * Score based race type.
	 */
	type: RaceType.SCORE_BASED;
	/**
	 * Time limit for the user to achieve the highest score [minutes].
	 */
	playLimit: number;
}

/**
 * Race which is time based - members need to complete the run as soon as possible.
 */
export interface RaceTimeBased extends Omit<BaseRace, 'type'> {
	/**
	 * Time based race type.
	 */
	type: RaceType.TIME_BASED;
}

/**
 * This is a type of a single object within the collection "race".
 * A single object describes a single race.
 */
export type Race = RaceScoreBased | RaceTimeBased;
