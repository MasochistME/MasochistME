import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "patreonTiers".
 * A single object describes a single Patreon tier.
 */
export type PatreonTier = WithId<{
	tier: string; // Usually just a stringified number.
	symbol: string; // A FontAwesome icon classname (for example `fas fa-star`).
	description: string; // Name of the Patreon tier. Will be displayed on eligible members' profiles.
}>;
