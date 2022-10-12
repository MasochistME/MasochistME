import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "memberBadges".
 * A single object describes a single badge belonging to a single member.
 */
export type MemberBadge = WithId<{
	badgeId: string;
	memberId: string;
	unlocked: Date;
}>;
