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
  const strDate = typeof date === "string" ? date : String(date);
  return Date.parse(strDate ?? 0);
};
