import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "badges".
 * A single object describes a single badge.
 */
export type BaseBadge = WithId<{
	name: string; // Name of the badge.
	img: string; // Image associated with the badge. Ideally should be 64x64.
	points: number; // Numeric value (stored as string for some reason).
	requirements: string; // Ideally it should be `video`|`screenshot`.
	description: string; // Short description of the badge.
	enabled: boolean; // [Is it even used?]
	legacy: boolean; // [Is it even used?]
}>;

interface BadgeGameSteam extends BaseBadge {
	gameId: number; //  Steam game ID. If null, the game is not a Steam game.
	title: null; // Title of the game. If null, the game is a Steam game.
	isSteamGame: true;
}

interface BadgeGameNonSteam extends BaseBadge {
	gameId: null; // Steam game ID. If null, the game is not a Steam game.
	title: string; // Title of the game. If null, the game is a Steam game.
	isSteamGame: false;
}

export type Badge = BadgeGameSteam | BadgeGameNonSteam;
