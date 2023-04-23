import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "badges".
 * A single object describes a single badge.
 */
export type Badge = WithId<{
	name: string; // Name of the badge.
	img: string; // Image associated with the badge. Ideally should be 64x64.
	points: string; // Numeric value (stored as string for some reason).
	requirements: string; // Ideally it should be `video`|`screenshot`.
	description: string; // Short description of the badge.
	gameId: string | null; // Game ID on Steam. If null, the game is not a Steam game.
	game?: string; // Title of the game (field is used only if the game is a non-Steam game).
	enabled: boolean; // [Is it even used?]
	legacy: boolean; // [Is it even used?]
}>;
