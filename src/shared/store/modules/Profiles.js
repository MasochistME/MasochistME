// CONSTANTS
export const SHOW_PROFILE = 'SHOW_PROFILE'

// ACTION CREATORS
export function showProfile(id) {
    return {
        type: SHOW_PROFILE,
        id
    }
}