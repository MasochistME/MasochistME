export const getPercentage = (a: number, b: number) => {
	const percentage = (100 * a) / b;
	if (Number.isNaN(percentage)) return '—';

	const fixedPercentage = percentage.toFixed(2);
	return `${fixedPercentage}%`;
};
