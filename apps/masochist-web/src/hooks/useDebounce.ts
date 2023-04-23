import { useEffect } from 'react';

export const useDebounce = <T>(
	value: T,
	debouncedValue: T,
	setDebouncedValue: (debouncedValue: T) => void,
	delay = 500,
	track?: () => void,
) => {
	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
				if (track) track();
			}, delay);

			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay], // Only re-call effect if value or delay changes
	);

	return debouncedValue;
};
