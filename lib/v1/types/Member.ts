import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "members".
 * A single object describes a single member.
 */
export type Member = WithId<{
	name: string;
	steamId: string;
	discordId: string;
	description: string | null;
	avatar: string;
	url: string;
	lastUpdated: Date;
	isPrivate: boolean;
	isMember: boolean;
	isProtected: boolean;
	ranking?: any; // TODO FIX!!!
}>;

export type MemberIdEither =
	| { steamId: string; discordId?: never }
	| { steamId?: never; discordId: string };
