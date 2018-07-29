// CONSTANTS
export const SEARCH_GAMES_VALUE = 'SEARCH_GAMES_VALUE'
export const SEARCH_MEMBERS_VALUE = 'SEARCH_MEMBERS_VALUE'

// ACTION CREATORS
export function searchGames(game) {
    return {
        type: SEARCH_GAMES_VALUE,
        game: game
    }
}
export function searchMembers(member) {
    return {
        type: SEARCH_MEMBERS_VALUE,
        member: member
    }
}