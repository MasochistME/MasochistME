// CONSTANTS
export const SEARCH_GAME = 'SEARCH_GAME';
export const SEARCH_USER = 'SEARCH_USER';

// ACTION CREATORS
export function searchGames(game: any): any {
	return {
		type: SEARCH_GAME,
		game,
	};
}
export function searchUsers(user: any): any {
	return {
		type: SEARCH_USER,
		user,
	};
}
