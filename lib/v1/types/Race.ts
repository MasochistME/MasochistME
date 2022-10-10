import { WithId } from 'mongodb';

export enum RaceType {
	TIME_BASED = 'time',
	SCORE_BASED = 'score',
}

/**
 * This is a type of a single object within the collection "race".
 * A single object describes a single race.
 */
export type BaseRace = WithId<{
	name: string;
	instructions: string;
	type: keyof typeof RaceType;
	startTime: Date; // A date in a timestamp format.
	endTime: Date; // A date in a timestamp format.
	downloadLink: string; // URL to the game's website.
	downloadGrace: number; // Time to download the game [seconds].
	uploadGrace: number; // Time to upload a proof of finishing the game [seconds].
	organizer: string; // Discord ID of the race's organizer.
	isActive: boolean;
	icon?: string; // URL of the race's icon
}>;

export interface RaceScoreBased extends Omit<BaseRace, 'type'> {
	type: RaceType.SCORE_BASED;
	playLimit: number; // Time limit for the user to achieve the highest score [minutes].
}

export interface RaceTimeBased extends Omit<BaseRace, 'type'> {
	type: RaceType.TIME_BASED;
}

export type Race = RaceScoreBased | RaceTimeBased;
