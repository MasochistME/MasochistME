import { useAppContext } from 'context';
import { useLocalStorage, useMixpanel } from 'hooks';
import { useEffect } from 'react';
import { assets, colors } from 'styles';
import { Theme } from 'styles/theme';

const DEFAULT_THEME = { theme: Theme.ASH };

export const useTheme = () => {
	const { track } = useMixpanel();
	const [activeTheme, setActiveTheme] = useLocalStorage<Record<string, Theme>>(
		'MME_THEME',
		DEFAULT_THEME,
	);
	const { _activeTheme, _setActiveTheme } = useAppContext();

	if (!activeTheme?.theme) setActiveTheme(DEFAULT_THEME);

	useEffect(() => {
		_setActiveTheme(activeTheme?.theme ?? Theme.ASH);
	}, [activeTheme]);

	const colorTokens = colors[_activeTheme];
	const assetTokens = assets[_activeTheme];
	const LOGO_URL_STATIC = 'http://cdn.masochist.me/files/LOGO.png';
	const LOGO_URL = assets[_activeTheme]['core-logo'];
	const BG_URL = assets[_activeTheme]['core-background'];
	const SH_URL = assets[_activeTheme]['core-subheader'];

	const changeTheme = () => {
		if (activeTheme.theme === Theme.ASH) {
			setActiveTheme({ theme: Theme.MEAT });
			track('theme.change', { theme: Theme.MEAT });
		}
		if (activeTheme.theme === Theme.MEAT) {
			setActiveTheme({ theme: Theme.ASH });
			track('theme.change', { theme: Theme.ASH });
		}
		// if (activeTheme.theme === Theme.MEAT) {
		// 	setActiveTheme({ theme: Theme.DUST });
		// track('theme.change', { theme: Theme.DUST });
		// }
		// if (activeTheme.theme === Theme.DUST) {
		// 	setActiveTheme({ theme: Theme.ASH });
		// }
	};

	return {
		activeTheme,
		changeTheme,
		colorTokens,
		assetTokens,
		LOGO_URL_STATIC,
		LOGO_URL,
		BG_URL,
		SH_URL,
	};
};
