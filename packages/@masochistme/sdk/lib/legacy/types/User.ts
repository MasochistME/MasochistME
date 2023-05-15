import { WithId } from 'mongodb';

import { TierId } from './Points';

/**
 * This is a type of a single object within the collection "users".
 * A single object describes a single Masochist.ME member.
 */
export type User = WithId<{
	id: string; // A Steam ID.
	name: string;
	avatar: string; // URL to the member's Steam avatar.
	updated: number; // A date in a timestamp format, representing when the member's Masochist.ME profile was last updated.
	url: string; // URL of the member's Steam profile.

	discordId?: string; // Member's Discord ID (visible only if member connected their account)
	description?: string; // User's self-assigned description, visible on their Masochist.ME profile.

	ranking: UserRanking;
	games: UserGame[];
	badges: UserBadge[];

	private: boolean; // If true, member's Steam profile is set to private.
	member: boolean; // If the user is a member of Masochist.ME curator.
	protected: boolean; // If set to true, user is displayed on the website even if not a member of Masochist.ME curator.
}>;

/**
 * Shows how many games from every tier this member has completed.
 */
export type UserRanking = Record<TierId, number>;

/**
 * Masochist.ME Steam curator games owned by the member.
 */
export type UserGame = {
	appid: number; // Steam's game ID.
	playtime_forever: string; // Stringified number representing hours of playtime.
	completionRate: number; // The percentage completion rate of a Steam game [0-100].
	lastUnlocked: number; // // A date in a timestamp format [s].
	achievements: UserGameAchievement[];
};

/**
 * Game achievements unlocked by the member.
 */
export type UserGameAchievement = {
	apiname: string; // Steam's ID of the achievement.
	achieved: 1; // A numeric boolean value representing if the user unlocked the achievement. Only the ones with value 1 are saved.
	unlocktime: number; // A date in a timestamp format [s]
};

/**
 * Badges collected by member.
 */
export type UserBadge = {
	id: string; // A stringified ObjectID representing the badge's _id.
	unlocked: number; // A date in a timestamp format, representing when member unlocked the badge.
};
