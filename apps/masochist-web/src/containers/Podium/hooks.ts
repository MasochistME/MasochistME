import { useTheme } from 'styles';

export const usePodiumColor = (place?: 1 | 2 | 3): string => {
	const { colorTokens } = useTheme();
	if (place === 1) return colorTokens['semantic-color--tier-4'];
	if (place === 2) return colorTokens['semantic-color--tier-3'];
	if (place === 3) return colorTokens['semantic-color--tier-2'];
	return colorTokens['common-color--shadow'];
};
