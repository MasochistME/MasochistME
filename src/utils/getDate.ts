import dayjs from 'dayjs';

export const getHumanReadableDate = (
	date: Date | number | null | undefined,
	withHours?: boolean,
) => {
	if (date === null || date === undefined) return '—';
	const format = withHours ? 'D MMM YYYY, H:mm:ss' : 'D MMM YYYY';
	return dayjs(date).format(format);
};
