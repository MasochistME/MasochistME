// CONSTANTS
export const CACHE_PATRONS = 'CACHE_PATRONS';
export const CACHE_STATUS = 'CACHE_STATUS';

// ACTION CREATORS
export function cachePatrons(data: any): any {
	return {
		type: CACHE_PATRONS,
		data,
	};
}
export function cacheStatus(data: any): any {
	return {
		type: CACHE_STATUS,
		data,
	};
}
