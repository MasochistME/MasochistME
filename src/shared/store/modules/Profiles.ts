// CONSTANTS
export const SHOW_PROFILE = 'SHOW_PROFILE';

// ACTION CREATORS
export function showProfile(id: any): any {
  return {
    type: SHOW_PROFILE,
    id,
  };
}
