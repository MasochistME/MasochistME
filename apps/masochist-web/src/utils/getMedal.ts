/**
 * Returns a medal emoji if someone won a race
 * @param place number
 * @returns medal lol
 */
export const getMedal = (place?: number) => {
	if (!place) return '—';
	if (place === 1) return '🥇';
	if (place >= 2 && place < 4) return '🥈';
	if (place >= 4 && place < 7) return '🥉';
};
