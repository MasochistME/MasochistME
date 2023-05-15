export const draw = (): number => Math.floor(Math.random() * 100 + 1);

export const botRefuses = (): boolean => happensWithAChanceOf(1);

export const happensWithAChanceOf = (percentageChance: number): boolean =>
  draw() <= percentageChance ? true : false;

export const chooseRandom = <T>(list: Array<T>): T =>
  list[Math.floor(Math.random() * list.length)];
