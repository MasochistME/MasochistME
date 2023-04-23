import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "points".
 * A single object describes a single tier.
 */
export type Points = WithId<{
	symbol: string; // Unicode symbol of a tier (for example 🌟).
	icon: string; // A FontAwesome icon classname (for example `fas fa-star`).
	score: number; // Numeric point value of a tier.
	description: string; // Short description, displayed on a website.
	id: TierId; // ID of a tier, usually a stringified number from 1 to 5.
}>;

export type TierId = '1' | '2' | '3' | '4' | '5';
