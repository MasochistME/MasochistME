import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

export const initializeDayJS = () => {
  dayjs.extend(customParseFormat);
  dayjs.extend(relativeTime);
};
