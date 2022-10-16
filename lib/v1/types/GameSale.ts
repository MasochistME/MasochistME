/**
 * @module Games
 */

import { WithId } from 'v1/types/Mongo';

/**
 * Information about the current sale of a particular game.
 */
export interface GameSale extends WithId {
	/**
	 * Steam ID of the game currently being on sale.
	 */
	gameId: number;
	/**
	 * Percentage value of the discount [0-100].
	 */
	discount: number;
}
