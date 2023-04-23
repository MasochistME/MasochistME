/**
 * @module Members
 */

import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "members".
 * A single object describes a single member.
 *
 * **Important**: there are several BREAKING changes here in comparison to the legacy Member format:
 *
 * - `id` → **renamed** to `steamID`
 * - `games` → **removed**
 * - `ranking` → **removed**
 * - `badges` → **removed**
 * - `url` → **removed** (can be constructed using member's Steam ID)
 */
export interface Member extends WithId {
	/**
	 * Member's Steam username.
	 */
	name: string;
	/**
	 * Member's Steam ID.
	 */
	steamId: string;
	/**
	 * Member's Discord ID (if their account was registered).
	 */
	discordId: string | null;
	/**
	 * Member's MasochistME profile description.
	 */
	description: string | null;
	/**
	 * Link to member's Steam avatar.
	 */
	avatar: string;
	/**
	 * Hash of the member's Steam avatar (used to generate avatars of various sizes).
	 */
	avatarHash?: string;
	/**
	 * Date of the last update of the member's MasochistME profile.
	 */
	lastUpdated: Date;
	/**
	 * Indicates if the member's Steam profile is set to private.
	 */
	isPrivate: boolean;
	/**
	 * Indicates if member is a member of the MasochistME Steam curator.
	 */
	isMember: boolean;
	/**
	 * If the member is not currently a part of curator, this flag will protect them from being removed from website.
	 */
	isProtected: boolean;
}

/**
 * Type used when it does not matter what type of ID member provides while trying to retrieve their data.
 */
export type MemberIdEither =
	| { steamId: string; discordId?: never }
	| { steamId?: never; discordId: string };
