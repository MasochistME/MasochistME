/** @module Races */

import { WithId } from 'mongodb';
import { RaceType } from './Race';

/**
 * BaseRacePlayer
 *
 * @category  Races
 * @memberof  Races
 * @alias     BaseRacePlayer
 *
 * Fields which are common for participants of all types of races.
 */
export type BaseRacePlayer = WithId<{
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
	 * Time when member clicked the START button.
	 */
	startTime: Date | null;
	/**
	 * Time when member clicked the FINISH button.
	 */
	endTime: Date | null;
	/**
	 * If true, participant gave up.
	 */
	dnf: boolean;
}>;

/**
 * RacePlayerScore
 *
 * @category  Races
 * @memberof  Races
 * @alias     RacePlayerScore
 *
 * Fields required only for participants of score based races.
 */
export interface RacePlayerScore extends Omit<BaseRacePlayer, 'type'> {
	/**
	 * Score based race type.
	 */
	type: RaceType.SCORE_BASED;
	/**
	 * Score that participant achieved in the given limit of time.
	 */
	score: number | null;
}

/**
 * RacePlayerTime
 *
 * @category  Races
 * @memberof  Races
 * @alias     RacePlayerTime
 *
 * Fields required only for participants of time based races.
 */
export interface RacePlayerTime extends Omit<BaseRacePlayer, 'type'> {
	/**
	 * Time based race type.
	 */
	type: RaceType.TIME_BASED;
}

/**
 * RacePlayer
 *
 * @category  Races
 * @memberof  Races
 * @alias     RacePlayer
 *
 * This is a type of a single object within the collection "racePlayers".
 * A single object describes a single participant in a single race.
 */
export type RacePlayer = RacePlayerScore | RacePlayerTime;
