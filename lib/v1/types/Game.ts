import { WithId } from 'mongodb';

/**
 * This is a type of a single object within the collection "games".
 * A single object describes a single game.
 */
export type Game = WithId<{
	id: number; // Steam ID of the game.
	title: string;
	description: string;
	rating: TierId; // indicates the point value for completing the game.
	img: string; // URL of the image.
	achievements: GameAchievements;
	url: string; // URL to the game's Steam website.
	sale: GameSale;
	isCurated: boolean; // Indicates if the game is currently being curated on Masochist.ME Steam curator.
	isProtected: boolean; // If true, removing the game from curator does not remove it from Masochist.ME website.
}>;

export type GameSale = {
	onSale: boolean;
	discount: number; // If the game is on sale, this is the percentage value of it [0-100].
};

export type GameAchievements = {
	total: number; // A total number of achievements that the game has.
	list: []; // Currently this field is always an empty array.
};

// TODO this is temp
export type TierId = '1' | '2' | '3' | '4' | '5';
