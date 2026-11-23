import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

export const initializeDayJS = () => {
  dayjs.extend(customParseFormat);
  dayjs.extend(relativeTime);
};
