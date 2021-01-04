// CONSTANTS
export const SHOW_GAMES_RATED = 'SHOW_GAMES_RATED';

// ACTION CREATORS
export function showGamesRated(ratingArray: any): any {
  return {
    type: SHOW_GAMES_RATED,
    showGamesRated: ratingArray,
  };
}
