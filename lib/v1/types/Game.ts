/**
 * @module Games
 */

import { WithId } from 'v1/types/__Helpers';
import { TierId } from 'v1/types/Tier';

/**
 * This is a type of a single object within the collection "games".
 * A single object describes a single game.
 *
 * **Important**: there are several BREAKING changes here in comparison to the legacy Game format:
 *
 * - `id` → **type change** → was `string`, is `number`
 * - `rating` → **removed**
 * - `img` → **removed** (can be constructed using just Steam ID in the following way: `https://cdn.akamai.steamstatic.com/steam/apps/${GAME_ID}/header.jpg`)
 * - `achievements` → **removed**
 * - `achievementsTotal` → **added**
 * - `url` → **removed** (can be constructed using just Steam ID in the following way: `http://store.steampowered.com/api/appdetails?appids=${GAME_ID}`)
 * - `sale` → **removed**
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
	tier: TierId;
	/**
	 * Number of the achievements total that the game has.
	 */
	achievementsTotal: number;
	/**
	 * Full price of the game in whatever currency is detected.
	 */
	price: number | null;
	/**
	 * Currency of the game's price.
	 */
	currency: string | null;
	/**
	 * When the game is on sale, this field shows the % discount.
	 */
	sale: number | null;
	/**
	 * Indicates if the game is currently being curated on Masochist.ME Steam curator.
	 */
	isCurated: boolean;
	/**
	 * If true, removing the game from curator does not remove it from Masochist.ME website.
	 */
	isProtected: boolean;
}
