/**
 * Chooses a random number between 0 and 100.
 */
export const draw = (): number => Math.floor(Math.random() * 100 + 1);

/**
 * Returns a random element from a predetermined array.
 */
export const chooseRandom = <T>(list: T[]): T =>
  list[Math.floor(Math.random() * list.length)];

/**
 * Returns a random index from an array of predetermined length.
 */
export const chooseRandomIndex = <T>(list: T[]): number =>
  Math.floor(Math.random() * list.length);

/**
 * Given the percentage chance, determines if event happens or not.
 */
export const happensWithAChanceOf = (percentageChance: number): boolean =>
  draw() <= percentageChance ? true : false;
