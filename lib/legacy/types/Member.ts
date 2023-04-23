import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "members".
 * A single object describes a single Masochist.ME member.
 */
export type Member = WithId<{
	id: string; // Steam ID of a member.
	groups: string[]; // List of group names that this member should have.
}>;
