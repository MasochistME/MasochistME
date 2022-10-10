import { WithId } from 'mongodb';

import { TierId } from './Points';

/**
 * This is a type of a single object within the collection "points".
 * A single object describes a single tier.
 */
export type Game = WithId<{
	id: string; // A stringified number representing the game's Steam ID.
	desc: string;
	rating: TierId; // indicates the point value for completing the game.
	title: string;
	img: string; // URL of the image.
	achievements: GameAchievements;
	url: string; // URL to the game's Steam website.
	sale: GameAchievements;
	curated: boolean; // Indicates i the game is currently being curated on Masochist.ME Steam curator.
	protected: boolean; // If true, removing the game from curator does not remove it from Masochist.ME website.
}>;

export type GameSale = {
	onSale: boolean;
	discount: number; // If the game is on sale, this is the percentage value of it [0-100].
};

export type GameAchievements = {
	total: number; // A total number of achievements that the game has.
	list: []; // Currently this field is always an empty array.
};
