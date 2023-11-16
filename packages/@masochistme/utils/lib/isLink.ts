/**
 * Checks if the passed string is a link (starts with http).
 * @param supposedLink string
 * @return boolean
 */
export const isLink = (supposedLink: string): boolean =>
  supposedLink.startsWith('http');
