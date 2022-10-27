/**
 * Compares string a with string b
 * @param a
 * @param b
 * @returns
 */
export const stringCompare = (a = '', b = ''): any => {
	const al = a.replace(/\s+/g, '');
	const bl = b.replace(/\s+/g, '');
	return al.localeCompare(bl, 'nb');
};

/**
 * Compares two booleans
 * @param a
 * @param b
 * @returns
 */
export const booleanCompare = (a = false, b = false): any => {
	const a1 = a ? 'true' : 'false';
	const b1 = b ? 'true' : 'false';
	return stringCompare(a1, b1);
};

/**
 * This is a function deduplicating elements in array.
 * Should be used within filter function
 * @param value current element of array
 * @param index index of current element
 * @param arrToDedup array to dedup
 * @returns array Deduped array
 */
export const dedupArray = <T>(value: T, index: number, arrToDedup: T[]) => {
	return arrToDedup.indexOf(value) === index;
};
