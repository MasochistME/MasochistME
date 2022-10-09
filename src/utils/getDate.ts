export const getDateFromDelay = (delay: number) => {
  const time = Date.now();
  const delayInMs = delay * 60 * 60 * 1000;
  const date = new Date(time + delayInMs);
  return date;
};
