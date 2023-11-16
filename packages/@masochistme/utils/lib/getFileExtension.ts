export const getFileExtension = (url: string): string | null => {
  const regex = new RegExp(/\.(\w{3,4})(?:$|\?)/i);
  const extension = regex.exec(url)?.[1] ?? null;
  return extension;
};
