// CONSTANTS
export const CHANGE_GAMES_VIEW = 'CHANGE_GAMES_VIEW';

// ACTION CREATORS
export function changeGamesView(view: 'list' | 'tiles'): any {
	return {
		type: CHANGE_GAMES_VIEW,
		view,
	};
}
