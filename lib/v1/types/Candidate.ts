/**
 * @module Candidates
 */

import { TierId } from './Tier';

/**
 * This is a type of a single object representing a single Steam game
 * curated on Masochist.ME, which got perfected by a Steam's user
 * (does not have to be MasochistME member)
 */
export interface CandidateGame {
	/**
	 * Steam ID of the game that candidate has perfected.
	 */
	id: number;
	/**
	 * Title of the game.
	 */
	title: string;
	/**
	 * MasochistME tier of the game.
	 */
	tier: TierId;
	/**
	 * Points that candidate earned for the game.
	 */
	pts: number;
}
