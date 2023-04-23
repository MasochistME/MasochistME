export const chooseRandom = <T>(list: T[]): T =>
	list[Math.floor(Math.random() * list.length)];

export const chooseRandomIndex = <T>(list: T[]): number =>
	Math.floor(Math.random() * list.length);
