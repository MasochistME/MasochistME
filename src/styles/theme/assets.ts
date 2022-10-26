import { Theme } from './theme';

export type AssetTokens = {
	'core-background': string;
	'core-logo': string;
	'core-subheader': string;
};

export const assets: Record<Theme, AssetTokens> = {
	[Theme.ASH]: {
		'core-background': 'http://cdn.masochist.me/assets/bg/bg_ash.jpg',
		'core-logo': 'http://cdn.masochist.me/assets/logo/logo_ash.png',
		'core-subheader': 'http://cdn.masochist.me/assets/sh/sh_ash.png',
	},
	[Theme.MEAT]: {
		'core-background': 'http://cdn.masochist.me/assets/bg/bg_meat.jpg',
		'core-logo': 'http://cdn.masochist.me/assets/logo/logo_meat.png',
		'core-subheader': 'http://cdn.masochist.me/assets/sh/sh_meat.png',
	},
	[Theme.DUST]: {
		'core-background': 'http://cdn.masochist.me/assets/bg/bg_dust.jpg',
		'core-logo': 'http://cdn.masochist.me/assets/logo/logo_dust.png',
		'core-subheader': 'http://cdn.masochist.me/assets/sh/sh_dust.png',
	},
};
