export const swapRatingToIcon = (
  scoreID: string | number,
  rating: any,
): string => {
  return rating
    ? rating.find((r: any) => r.id === scoreID).icon
    : 'fas fa-spinner';
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
 * Compares two booleans
 * @param a
 * @param b
 * @returns
 */
export const booleanCompare = (a = false, b = false): any => {
  const a1 = a ? 'true' : 'false';
  const b1 = b ? 'true' : 'false';
  return stringCompare(a1, b1);
};
