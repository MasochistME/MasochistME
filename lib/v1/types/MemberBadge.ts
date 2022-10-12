import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "memberBadges".
 * A single object describes a single badge belonging to a single user.
 */
export type MemberBadge = WithId<{
	badgeId: string;
	userId: string;
	unlocked: Date;
}>;
