// CONSTANTS
export const CACHE_GAMES = 'CACHE_GAMES';
export const CACHE_MEMBERS = 'CACHE_MEMBERS';
export const CACHE_RATING = 'CACHE_RATING';
export const CACHE_EVENTS = 'CACHE_EVENTS';
export const CACHE_BLOG = 'CACHE_BLOG';
export const CACHE_PATRONS = 'CACHE_PATRONS';
export const CACHE_BADGES = 'CACHE_BADGES';

// ACTION CREATORS
export function cacheGames(data: any): any {
  return {
    type: CACHE_GAMES,
    data: data,
  };
}
export function cacheRating(data: any): any {
  return {
    type: CACHE_RATING,
    data: data,
  };
}
export function cacheMembers(data: any): any {
  return {
    type: CACHE_MEMBERS,
    data: data,
  };
}
export function cacheEvents(data: any): any {
  return {
    type: CACHE_EVENTS,
    data: data,
  };
}
export function cacheBlog(data: any): any {
  return {
    type: CACHE_BLOG,
    data: data,
  };
}
export function cachePatrons(data: any): any {
  return {
    type: CACHE_PATRONS,
    data: data,
  };
}
export function cacheBadges(data: any): any {
  return {
    type: CACHE_BADGES,
    data: data,
  };
}
