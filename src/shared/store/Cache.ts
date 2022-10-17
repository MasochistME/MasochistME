// CONSTANTS
export const CACHE_USERS = 'CACHE_USERS';
export const CACHE_BLOG = 'CACHE_BLOG';
export const CACHE_PATRONS = 'CACHE_PATRONS';
export const CACHE_RANKING = 'CACHE_RANKING';
export const CACHE_STATUS = 'CACHE_STATUS';
export const CACHE_USER_DETAILS = 'CACHE_USER_DETAILS';

// ACTION CREATORS
export function cacheUsers(data: any): any {
	return {
		type: CACHE_USERS,
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
