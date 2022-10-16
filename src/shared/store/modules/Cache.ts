// CONSTANTS
export const CACHE_GAMES = 'CACHE_GAMES';
export const CACHE_USERS = 'CACHE_USERS';
export const CACHE_RATING = 'CACHE_RATING';
export const CACHE_EVENTS = 'CACHE_EVENTS';
export const CACHE_BLOG = 'CACHE_BLOG';
export const CACHE_PATRONS = 'CACHE_PATRONS';
export const CACHE_RANKING = 'CACHE_RANKING';
export const CACHE_STATUS = 'CACHE_STATUS';
export const CACHE_USER_DETAILS = 'CACHE_USER_DETAILS';
export const CACHE_GAME_DETAILS = 'CACHE_GAME_DETAILS';

// ACTION CREATORS
export function cacheGames(data: any): any {
	return {
		type: CACHE_GAMES,
		data,
	};
}
export function cacheRating(data: any): any {
	return {
		type: CACHE_RATING,
		data,
	};
}
export function cacheUsers(data: any): any {
	return {
		type: CACHE_USERS,
		data,
	};
}
export function cacheEvents(data: any): any {
	return {
		type: CACHE_EVENTS,
		data,
	};
}
export function cacheBlog(data: any): any {
	return {
		type: CACHE_BLOG,
		data,
	};
}
export function cachePatrons(data: any): any {
	return {
		type: CACHE_PATRONS,
		data,
	};
}
export function cacheRanking(data: any): any {
	return {
		type: CACHE_RANKING,
		data,
	};
}
export function cacheStatus(data: any): any {
	return {
		type: CACHE_STATUS,
		data,
	};
}
export function cacheUserDetails(data: any): any {
	return {
		type: CACHE_USER_DETAILS,
		data,
	};
}
export function cacheGameDetails(data: any): any {
	return {
		type: CACHE_GAME_DETAILS,
		data,
	};
}
