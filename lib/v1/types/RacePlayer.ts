/**
 * @module Races
 */

import { WithId } from 'v1/types/__Helpers';
import { RaceType } from 'v1/types/Race';

/**
 * Fields which are common for participants of all types of races.
 */
interface BaseRacePlayer extends WithId {
	/**
	 * Discord ID of the participant.
	 */
	discordId: string;
	/**
	 * ID of the race that user participates in (stringified ObjectId).
	 */
	raceId: string;
	/**
	 * Type of the race that the member participates in.
	 */
	type: keyof typeof RaceType;
	/**
	 * Time when member revealed the race info.
	 */
	revealDate: Date | null;
	/**
	 * Time when member clicked the START button.
	 */
	startDate: Date | null;
	/**
	 * Time when member clicked the FINISH button.
	 */
	endDate: Date | null;
	/**
	 * Time when member uploaded the proof.
	 */
	proofDate: Date | null;
	/**
	 * If true, participant gave up.
	 */
	dnf: boolean;
	/**
	 * Link to screenshot or other proof of finishing a race.
	 */
	proof: string | null;
	/**
	 * A field for mods to disqualify a player even if they finished a race.
	 */
	disqualified: boolean;
	/**
	 * Discord ID of the mod who disqualified a player.
	 */
	disqualifiedBy: string | null;
	/**
	 * Reason for disqualification.
	 */
	disqualificationReason: string | null;
	/**
	 * Calculated place of a player in a particular race (not stored in database)
	 */
	place?: number;
}

/**
 * Participant of a score based race.
 */
export interface RacePlayerScore extends Omit<BaseRacePlayer, 'type'> {
	/**
	 * Score based race type.
	 */
	type: RaceType.SCORE_BASED;
	/**
	 * If participant got warned that their time is ending.
	 */
	isWarned: boolean;
	/**
	 * Score that participant achieved in the given limit of time.
	 */
	score: number | null;
}

/**
 * Participant of a time based race.
 */
export interface RacePlayerTime extends Omit<BaseRacePlayer, 'type'> {
	/**
	 * Time based race type.
	 */
	type: RaceType.TIME_BASED;
	/**
	 * Player's score (not stored in database, only returned from endpoint)
	 */
	score?: number;
}

/**
 * This is a type of a single object within the collection "racePlayers".
 * A single object describes a single participant in a single race.
 */
export type RacePlayer = RacePlayerScore | RacePlayerTime;
