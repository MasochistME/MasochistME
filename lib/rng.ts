export const draw = () => Math.floor((Math.random() * 100) + 1);
export const botRefuses = () => happensWithAChanceOf(1);
export const happensWithAChanceOf = (percentageChance:number) => 
    draw() <= percentageChance
        ? true
        : false
export const chooseRandom = (list:Array<any>) => list[Math.floor(Math.random() * list.length)];