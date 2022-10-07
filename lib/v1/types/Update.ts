import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "update".
 * There's only one object in that collection and it stores data related to the website's Steam sync.
 */
export type Update = WithId<{
	id: 'lastUpdated';
	timestamp: number; // A date in a timestamp format.
	status: number; // A numeric value incidating the percentage progress of the Steam sync [0-100].
}>;
