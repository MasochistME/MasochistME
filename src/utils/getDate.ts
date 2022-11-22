import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateFromDelay = (delay: number) => {
  const time = Date.now();
  const delayInMs = delay * 60 * 60 * 1000;
  const date = new Date(time + delayInMs);
  return date;
};

export const getUTCDate = (date: Date | null) => {
  if (date === null) return "-";
  return dayjs(date).tz("UTC").format("DD. MMMM YYYY, H:mm:ss [(UTC)]");
};
