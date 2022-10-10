import { WithId } from 'mongodb';
import { RaceType } from './Race';

/**
 * This is a type of a single object within the collection "racePlayers".
 * A single object describes a single participant in a single race.
 */
export type BaseRacePlayer = WithId<{
	discordId: string; // Discord ID of the participant.
	raceId: string; // ID of the race that user participates in (stringified ObjectId).
	type: keyof typeof RaceType;
	startTime: Date | null; // Time when member clicked the START button.
	endTime: Date | null; // Time when member clicked the FINISH button.
}>;

export interface RacePlayerScore extends Omit<BaseRacePlayer, 'type'> {
	type: RaceType.SCORE_BASED;
	score: number | null; // Score if the race was score based.
}

export interface RacePlayerTime extends Omit<BaseRacePlayer, 'type'> {
	type: RaceType.TIME_BASED;
}

export type RacePlayer = RacePlayerScore | RacePlayerTime;
