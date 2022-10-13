// RacePlayer.ts
/** @module RacePlayer */

import { WithId } from 'mongodb';
import { RaceType } from './Race';

/**
 * BaseRacePlayer
 *
 * @category  Races
 * @memberof  RacePlayers
 * @alias     BaseRacePlayer
 *
 * Fields which are common for participants of all types of races.
 */
export type BaseRacePlayer = WithId<{
	discordId: string; // Discord ID of the participant.
	raceId: string; // ID of the race that user participates in (stringified ObjectId).
	type: keyof typeof RaceType;
	startTime: Date | null; // Time when member clicked the START button.
	endTime: Date | null; // Time when member clicked the FINISH button.
	dnf: boolean;
}>;

/**
 * RacePlayerScore
 *
 * @category  Races
 * @memberof  RacePlayers
 * @alias     RacePlayerScore
 *
 * Fields required only for participants of score based races.
 */
export interface RacePlayerScore extends Omit<BaseRacePlayer, 'type'> {
	type: RaceType.SCORE_BASED;
	score: number | null; // Score if the race was score based.
}

/**
 * RacePlayerTime
 *
 * @category  Races
 * @memberof  RacePlayers
 * @alias     RacePlayerTime
 *
 * Fields required only for participants of time based races.
 */
export interface RacePlayerTime extends Omit<BaseRacePlayer, 'type'> {
	type: RaceType.TIME_BASED;
}

/**
 * RacePlayer
 *
 * @category  Races
 * @memberof  RacePlayers
 * @alias     RacePlayer
 *
 * This is a type of a single object within the collection "racePlayers".
 * A single object describes a single participant in a single race.
 */
export type RacePlayer = RacePlayerScore | RacePlayerTime;
