export const sanitizeString = (input: string): string =>
  // eslint-disable-next-line no-misleading-character-class
  input.replace(/[^a-z0-9áéíóúñü .,_-✳☆✪🌟]/gim, '').trim();

export const splitArrayToChunks = <T>(arr: T[], chunkSize: number) => {
  const chunkArr: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk: T[] = arr.slice(i, i + chunkSize);
    chunkArr.push(chunk);
  }
  return chunkArr;
};
