import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export const getDateFromDelay = (delay: number) => {
  const time = Date.now();
  const delayInMs = delay * 60 * 60 * 1000;
  const date = new Date(time + delayInMs);
  return date;
};

export const getUTCDate = (date: Date | null) => {
  if (date === null) return "—";
  return dayjs(date).tz("UTC").format("DD. MMMM YYYY, H:mm:ss [(UTC)]");
};

export const getHumanReadableDate = (date: Date | null) => {
  if (date === null) return "—";
  return dayjs(date).format("D MMM YYYY, H:mm:ss");
};

export const getTimestampFromDate = (date: Date | string | null): number => {
  if (typeof date === "string") return Date.parse(date);
  if (date instanceof Date) return date.getTime();
  return 0;
};

export const getDiscordTimestamp = (date: Date | string | null): string => {
  const timestamp = (getTimestampFromDate(date) / 1000).toFixed(0);
  return `<t:${timestamp}:F> (<t:${timestamp}:R>)`;
};
