// CONSTANTS
export const CACHE_GAMES = 'CACHE_GAMES'
export const CACHE_MEMBERS = 'CACHE_MEMBERS'
export const CACHE_RATING = 'CACHE_RATING'

// ACTION CREATORS
export function cacheGames(data) {
    return {
        type: CACHE_GAMES,
        data: data
    }
}
export function cacheRating(data) {
    return {
        type: CACHE_RATING,
        data: data
    }
}
export function cacheMembers(data) {
    return {
        type: CACHE_MEMBERS,
        data: data
    }
}