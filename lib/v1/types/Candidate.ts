/**
 * @module Candidates
 */

import { TierId } from './Tier';

/**
 * This is a type of a single object representing a single candidate
 * (does not have to be MasochistME member)
 */
export interface Candidate {
	/**
	 * Candidate's Steam ID.
	 */
	steamId: string;
	/**
	 * Candidate's Steam persona name.
	 */
	name: string;
	/**
	 * Hash of the candidate's Steam avatar.
	 */
	avatarHash: string;
	/**
	 * List of candidate's perfected games.
	 */
	games: CandidateGame[];
	/**
	 * Date of the last data fetch for this specific candidate.
	 */
	updated: Date;
}

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
