import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

/**
 *
 * @param date
 * @param withHours
 * @returns
 */
export const getHumanReadableDate = (
  date: Date | number | null | undefined,
  withHours?: boolean,
) => {
  if (date === null || date === undefined) return '—';
  const format = withHours ? 'D MMM YYYY, H:mm:ss' : 'D MMM YYYY';
  return dayjs(date).format(format);
};

/**
 * Ingests a date in any format and returns a timestamp.
 * @param date Date | string | null
 * @returns number
 */
export const getTimestampFromDate = (date: Date | string | null): number => {
  if (typeof date === 'string') return Date.parse(date);
  if (date instanceof Date) return date.getTime();
  return 0;
};

/**
 *
 * @param delay
 * @returns
 */
export const getDateFromDelay = (delay: number) => {
  const time = Date.now();
  const delayInMs = delay * 60 * 60 * 1000;
  const date = new Date(time + delayInMs);
  return date;
};

/**
 *
 * @param date
 * @returns
 */
export const getUTCDate = (date: Date | null) => {
  if (date === null) return '—';
  return dayjs(date).tz('UTC').format('DD. MMMM YYYY, H:mm:ss [(UTC)]');
};

/**
 * Return date adjusted to Discord's user timezone
 * @param date
 * @returns string
 */
export const getDiscordDate = (date: Date | string | null): string => {
  const timestamp = (getTimestampFromDate(date) / 1000).toFixed(0);
  return `<t:${timestamp}:F>`;
};

/**
 * Return relative time from now - for example "a month ago"
 * @param date
 * @returns string
 */
export const getDiscordRelativeTime = (date: Date | string | null): string => {
  const timestamp = (getTimestampFromDate(date) / 1000).toFixed(0);
  return `<t:${timestamp}:R>`;
};

/**
 * Return a string showing both date adjusted for user's timezone
 * as well as Discord's relative date
 * @param date
 * @returns string
 */
export const getDiscordTimestamp = (date: Date | string | null): string => {
  const discordDate = getDiscordDate(date);
  const discordRelativeTime = getDiscordRelativeTime(date);
  return `${discordDate} (${discordRelativeTime})`;
};
