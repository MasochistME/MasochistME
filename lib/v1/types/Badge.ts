/** @module Badges */

import { WithId } from 'mongodb';

/**
 * Fields which are common for all types of badges.
 * @category  Badges
 */
export type BaseBadge = WithId<{
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
}>;

/**
 * Fields required only for badges belonging to a Steam game.
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
 * Fields required only for badges belonging to a non-Steam game.
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

/**
 * This is a type of a single object within the collection "badges".
 * A single object describes a single badge.
 * @category  Badges
 */
export type Badge = BadgeGameSteam | BadgeGameNonSteam;
