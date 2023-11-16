/**
 * Returns the cenzored version of a string.
 * @param text string
 * @return string
 */
export const cenzorString = (text: string) => {
  return Array(text.length).fill('█').join('');
};

/**
 * Tbh I don't remember what purpose this one had
 * It's used exclusively in masochist-api LEGACY router
 * @param input
 * @returns
 */
export const sanitizeString = (input: string): string =>
  // eslint-disable-next-line no-misleading-character-class
  input.replace(/[^a-z0-9áéíóúñü .,_-✳☆✪🌟]/gim, '').trim();

/**
 * Shorten the string to given length and add ellipsis if it was too long.
 * @param strFull String to shorten
 * @param maxLength Max length of the string after shortening
 * @returns string
 */
export const shortenString = (strFull: string, maxLength: number) => {
  const str =
    strFull.length >= maxLength
      ? strFull.substring(0, maxLength - 4) + '...'
      : strFull;
  return str;
};
