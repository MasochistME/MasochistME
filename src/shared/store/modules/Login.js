// CONSTANTS
export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL'
export const LOG_IN_USER = 'LOG_IN_USER'
export const LOG_OUT_USER = 'LOG_OUT_USER'

// ACTION CREATORS
export function showLoginModal() {
    return {
        type: SHOW_LOGIN_MODAL
    }
}
export function logInUser(username, privilege) {
    return {
        type: LOG_IN_USER,
        username: username,
        privilege: privilege
    }
}
export function logOutUser() {
    return {
        type: LOG_OUT_USER
    }
}