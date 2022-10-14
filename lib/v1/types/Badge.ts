import { WithId } from 'v1/types/Mongo';

/**
 * This is a type of a single object within the collection "badges".
 * A single object describes a single badge.
 * @category  Badges
 */
export type Badge = BadgeGameSteam | BadgeGameNonSteam;

/**
 * Fields which are common for all types of badges.
 * @category  Badges
 */
interface BaseBadge extends WithId {
	/**
	 * Name of the badge.
	 */
	name: string;
	/**
	 * Image associated with the badge. Ideally should be 64x64.
	 */
	img: string;
	/**
	 * Numeric value (stored as string for some reason).
	 */
	points: number;
	/**
	 * Ideally it should be `video`|`screenshot`.
	 */
	requirements: string;
	/**
	 * Short description of the badge.
	 */
	description: string;
	/**
	 * TODO [Is it even used?]
	 */
	enabled: boolean;
	/**
	 * TODO [Is it even used?]
	 */
	legacy: boolean;
}

/**
 * Badge for a Steam based game.
 * @category  Badges
 */
export interface BadgeGameSteam extends BaseBadge {
	/**
	 * Steam game ID. If null, the game is not a Steam game.
	 */
	gameId: number;
	/**
	 * Title of the game. If null, the game is a Steam game.
	 */
	title: null;
	/**
	 * This field is always true if the game is a Steam game, duh.
	 */
	isSteamGame: true;
}

/**
 * Badge for a non-Steam based game.
 * @category  Badges
 */
export interface BadgeGameNonSteam extends BaseBadge {
	/**
	 * Steam game ID. If null, the game is not a Steam game.
	 */
	gameId: null;
	/**
	 * Title of the game. If null, the game is a Steam game.
	 */
	title: string;
	/**
	 * This field is always false if the game is not a Steam game, duh.
	 */
	isSteamGame: false;
}
