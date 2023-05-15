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

/**
 * Compares string a with string b
 * @param a
 * @param b
 * @returns
 */
export const stringCompare = (a = '', b = ''): any => {
  const al = a.replace(/\s+/g, '');
  const bl = b.replace(/\s+/g, '');
  return al.localeCompare(bl, 'nb');
};

/**
 * Gets a timestamp from date.
 */
export const getTimestampFromDate = (date: Date | string | null): number => {
  if (typeof date === 'string') return Date.parse(date);
  if (date instanceof Date) return date.getTime();
  return 0;
};
