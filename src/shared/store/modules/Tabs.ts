// CONSTANTS
export const CHANGE_TAB = 'CHANGE_TAB';
export const CHANGE_GAMES_VIEW = 'CHANGE_GAMES_VIEW';

// ACTION CREATORS
export function changeTab(tab: any): any {
  return {
    type: CHANGE_TAB,
    tab,
  };
}

export function changeGamesView(view: 'list' | 'tiles'): any {
  return {
    type: CHANGE_GAMES_VIEW,
    view,
  };
}
