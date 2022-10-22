export const getPercentage = (a: number, b: number) => {
	const percentage = (100 * a) / b;
	return `${percentage.toFixed(2)}%`;
};
