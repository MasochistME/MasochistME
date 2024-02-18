/**
 * @module Races
 */

import { TierId } from './Tier';

/**
 * This is a type of a single object representing a single race rating
 * from a specific Discord user
 */
export interface RaceRating {
  /**
   * Discord ID of the race player
   */
	discordId: string;
  /**
   * ID of the rated race
   */
  raceId:string;
  /**
   * Fun rating of the race game
   */
  rating: number | null;
  /**
   * Difficulty rating of the race game
   */
  difficulty: number | null
}
