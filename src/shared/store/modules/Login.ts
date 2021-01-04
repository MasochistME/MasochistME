// CONSTANTS
export const SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL';
export const LOG_IN_USER = 'LOG_IN_USER';
export const LOG_OUT_USER = 'LOG_OUT_USER';

// ACTION CREATORS
export function showLoginModal(): any {
  return {
    type: SHOW_LOGIN_MODAL,
  };
}
export function logInUser(username: string, privilege: any, banned: boolean) {
  return {
    type: LOG_IN_USER,
    username: username,
    privilege: privilege,
    banned: banned,
  };
}
export function logOutUser(): any {
  return {
    type: LOG_OUT_USER,
  };
}
