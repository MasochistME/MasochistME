import { WithId } from 'mongodb';

import { PatreonTier } from './PatreonTier';

/**
 * This is a type of a single object within the collection "patrons".
 * A single object describes a single Masochist.ME patron.
 */
export type Patron = WithId<{
	steamid: string; // Steam ID of the patron.
	name: string; // Steam username of the patron.
	avatar: string; // URL to the patron's avatar.
	tier: PatreonTier['tier']; // tier of the patron's Patreon subscription.
}>;
