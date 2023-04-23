/**
 * @module Badges
 */
import { WithId } from 'v1/types/__Helpers';

/**
 * This is a type of a single object within the collection "badges".
 * A single object describes a single badge.
 */
export type Badge = BadgeGameSteam | BadgeGameNonSteam;

/**
 * Fields which are common for all types of badges.
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
	 * TODO
	 * When the game to which the badge belongs gets decurated, this flag switches to false.
	 */
	isEnabled: boolean;
	/**
	 * TODO [Is it even used?]
	 */
	isLegacy: boolean;
}

/**
 * Badge for a Steam based game.
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
