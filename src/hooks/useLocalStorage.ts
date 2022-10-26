import { useCallback, useState } from 'react';
import { log } from 'utils';

export const useLocalStorage = <T extends Record<string, any>>(
	key: string,
	initialValue: T,
) => {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue;
		}
		try {
			const item = window.localStorage.getItem(key);

			return item ? JSON.parse(item) : initialValue;
		} catch (error: any) {
			log.WARN(error);
			return initialValue;
		}
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = useCallback(
		(value: T) => {
			try {
				setStoredValue(value);
				if (typeof window !== 'undefined') {
					window.localStorage.setItem(key, JSON.stringify(value));
				}
			} catch (error: any) {
				log.WARN(error);
			}
		},
		[key, initialValue],
	);
	return [storedValue, setValue] as const;
};
