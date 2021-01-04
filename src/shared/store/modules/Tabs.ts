// CONSTANTS
export const CHANGE_TAB = 'CHANGE_TAB';

// ACTION CREATORS
export function changeTab(tab: any): any {
  return {
    type: CHANGE_TAB,
    tab: tab,
  };
}
