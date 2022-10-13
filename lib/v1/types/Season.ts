import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "seasons".
 * A single object describes a single race season.
 */
export type Season = WithId<{
	name: string;
	description: string;
	icon: string;
	startDate: Date | null;
	endDate: Date | null;
}>;
