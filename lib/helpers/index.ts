export const sanitizeString = (input: string): string =>
  // eslint-disable-next-line no-misleading-character-class
  input.replace(/[^a-z0-9áéíóúñü .,_-✳☆✪🌟]/gim, '').trim();
