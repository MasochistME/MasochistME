/**
 * @module Races
 */

import { WithId } from 'v1/types/__Helpers';
import { RacePlayer } from './RacePlayer';

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
	 * Discord ID of the race's owner.
	 */
	owner: string;
	/**
	 * ID of the season that this race belongs to (if null, it's a special non-seasoned race).
	 */
	season: string | null;
	/**
	 * URL of the race's icon.
	 */
	icon?: string;
	/**
	 * Flag indicating if the race is currently ongoing.
	 */
	isActive: boolean;
	/**
	 * Flag indicating if the race is finished and grace period after its end also finished.
	 */
	isDone: boolean;
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
	/**
	 * How much time before end of a run player is warned that their time is ending [minutes].
	 */
	warningPeriod: number;
	/**
	 * Score of the race's owner.
	 */
	ownerScore: number | null;
}

/**
 * Race which is time based - members need to complete the run as soon as possible.
 */
export interface RaceTimeBased extends Omit<BaseRace, 'type'> {
	/**
	 * Time based race type.
	 */
	type: RaceType.TIME_BASED;
	/**
	 * Time of the race's owner.
	 */
	ownerTime: number | null;
}

/**
 * This is a type of a single object within the collection "race".
 * A single object describes a single race.
 */
export type Race = RaceScoreBased | RaceTimeBased;

/**
 * Returns race data with all details about participants and leaderboards.
 */
export type RaceWithParticipants = Race & {
	/**
	 * List of all participants of a specific race.
	 */
	participants?: RacePlayer[];
	/**
	 * Leaderboards of a specific race (sorted players, removed DNFs)
	 */
	leaderboards?: RacePlayer[];
};

/**
 * Returns race data with simple summary about participants.
 */
export type RaceWithSummary = Race & {
	/**
	 * Object storing basic summary of the race.
	 */
	summary?: {
		/**
		 * Number of people who signed up for a race (clicked a JOIN button).
		 */
		signups: number;
		/**
		 * Number of people who signed up for a race, played and successfully finished it.
		 */
		participants: number;
		/**
		 * Number of people who signed up for a race and either never participated, forfeited or got disqualified.
		 */
		dnf: number;
		/**
		 * Discord ID of a race winner.
		 */
		winner: string | null;
		/**
		 * Array of Discord IDs of race participants (people who played and successfully finished a race).
		 */
		list: string[];
	};
};
