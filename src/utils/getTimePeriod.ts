export enum TimePeriod {
	ALL = 'all',
	PAST_WEEK = 'past_week',
	PAST_MONTH = 'past_month',
	PAST_YEAR = 'past_year',
}

export const getTimePeriod = (from: TimePeriod) => {
	const now = new Date();
	// We get the timestamp from the midnight of current day,
	// because using current timestamp creates unnecesary fetches
	// of the data on every rerender
	const timestamp = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	).getTime();

	if (from === TimePeriod.PAST_WEEK)
		return new Date(timestamp - 1000 * 60 * 60 * 24 * 7).toString();
	if (from === TimePeriod.PAST_MONTH)
		return new Date(timestamp - 1000 * 60 * 60 * 24 * 30).toString();
	if (from === TimePeriod.PAST_YEAR)
		return new Date(timestamp - 1000 * 60 * 60 * 24 * 365).toString();
};
