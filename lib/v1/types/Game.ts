/**
 * @module Games
 */

import { WithId } from 'v1/types/Mongo';
import { TierId } from 'v1/types/Tier';

/**
 * This is a type of a single object within the collection "games".
 * A single object describes a single game.
 */
export interface Game extends WithId {
	/**
	 * Steam ID of the game.
	 */
	id: number;
	/**
	 * Title of the game.
	 */
	title: string;
	/**
	 * Description of the game.
	 */
	description: string;
	/**
	 * ID of the tier that the game belongs to.
	 */
	rating: TierId;
	/**
	 * URL of the game's thumbnail.
	 */
	img: string;
	/**
	 * URL to the game's Steam website.
	 */
	url: string;
	/**
	 * List of the game's achievements.
	 */
	achievements: GameAchievements;
	/**
	 * Information about the game's current Steam sale.
	 */
	sale: GameSale;
	/**
	 * Indicates if the game is currently being curated on Masochist.ME Steam curator.
	 */
	isCurated: boolean;
	/**
	 * If true, removing the game from curator does not remove it from Masochist.ME website.
	 */
	isProtected: boolean;
}

/**
 * Information about the current sale of a particular game.
 */
export type GameSale = {
	/**
	 * Flag indicating if the game is currently on sale.
	 */
	onSale: boolean;
	/**
	 * If the game is on sale, this is the percentage value of the discount [0-100].
	 */
	discount: number;
};

/**
 * Information about achievements for a specific game.
 */
export type GameAchievements = {
	/**
	 * A total number of achievements that the game has.
	 */
	total: number;
	/**
	 * Currently this field is always an empty array.
	 */
	list: never[];
};
