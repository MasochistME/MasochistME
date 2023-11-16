/**
 * This is a function deduplicating elements in array.
 * Should be used within filter function
 * @param value current element of array
 * @param index index of current element
 * @param arrToDedup array to dedup
 * @returns array Deduped array
 */
export const dedupArray = <T>(value: T, index: number, arrToDedup: T[]) => {
  return arrToDedup.indexOf(value) === index;
};

/**
 * This is a function splitting array to X equal chunks.
 * @param arr array to split to chunks
 * @param chunkSize size of a chunk
 * @returns array Array of chunks
 */
export const splitArrayToChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  const chunkArr: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk: T[] = arr.slice(i, i + chunkSize);
    chunkArr.push(chunk);
  }
  return chunkArr;
};
