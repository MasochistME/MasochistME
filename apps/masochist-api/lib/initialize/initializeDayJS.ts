import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

export const initializeDayJS = () => {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);
};
