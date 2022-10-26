import { Theme } from './theme';

export type ColorTokens = {
	'core-primary-bg': string; // newDark
	'core-secondary-bg': string; //superDarkGrey
	'core-tertiary-bg': string; // black
	'core-primary-text': string; //superLightGrey
	'core-secondary-text': string; // lightGrey
	'core-tertiary-text': string; // white

	'semantic-color-idle': string; // newDarkBlue
	'semantic-color-interactive': string; // newMediumGrey
	'semantic-color-active': string; // white
	'semantic-color-disabled': string; // mediumGrey

	'semantic-color-warning-strong': string; // yellow
	'semantic-color-warning-muted': string; // tier4muted
	'semantic-color-error-strong': string; // mediumred
	'semantic-color-error-muted': string; // darkred

	'semantic-color-link-normal': string;
	'semantic-color-link-hover': string;
	'semantic-color-link-visited': string;
	'semantic-color-section-update--bg': string; // Color of the "Last updated" section in Subheader.
	'semantic-color-section-update--text': string; // Color of the "Last updated" section in Subheader.

	'semantic-color--tier-4': string;
	'semantic-color--tier-3': string;
	'semantic-color--tier-2': string;
	'semantic-color--tier-1': string;
};

export const colors: Record<Theme, ColorTokens> = {
	[Theme.ASH]: {
		'core-primary-bg': '#040404',
		'core-secondary-bg': '#141620',
		'core-tertiary-bg': '#0a0a0a',
		'core-primary-text': '#BEC9E0',
		'core-secondary-text': '#9e9db5',
		'core-tertiary-text': '#f0f0f0',

		'semantic-color-idle': '#282f44',
		'semantic-color-interactive': '#545281',
		'semantic-color-active': '#9895db',
		'semantic-color-disabled': '#7b7a8d',

		'semantic-color-warning-strong': '#fdc000',
		'semantic-color-warning-muted': '#a47b00',
		'semantic-color-error-strong': '#582e34',
		'semantic-color-error-muted': '#1e1012',

		'semantic-color-link-normal': '#f0f0f0',
		'semantic-color-link-hover': 'd0d0d0',
		'semantic-color-link-visited': 'c0c0c0',
		'semantic-color-section-update--bg': '#040404',
		'semantic-color-section-update--text': '#f0f0f0',

		'semantic-color--tier-4': '#fdc000',
		'semantic-color--tier-3': '#f5f5f5',
		'semantic-color--tier-2': '#ff6b1f',
		'semantic-color--tier-1': '#32a042',
	},
	[Theme.MEAT]: {
		'core-primary-text': '#f0f0f0',
		'core-secondary-text': '#f0f0f0',
		'core-tertiary-text': '#f0f0f0',
		'core-primary-bg': '#7e5252',
		'core-secondary-bg': '#4e1414',
		'core-tertiary-bg': '#623131',

		'semantic-color-idle': '#2a2121',
		'semantic-color-interactive': '#320303',
		'semantic-color-active': '#0a0a0a',
		'semantic-color-disabled': '#7b7a8d',

		'semantic-color-warning-strong': '#fdc000',
		'semantic-color-warning-muted': '#a47b00',
		'semantic-color-error-strong': '#582e34',
		'semantic-color-error-muted': '#1e1012',

		'semantic-color-link-normal': '#f0f0f0',
		'semantic-color-link-hover': 'd0d0d0',
		'semantic-color-link-visited': 'c0c0c0',
		'semantic-color-section-update--bg': '#c91745',
		'semantic-color-section-update--text': '#f0f0f0',

		'semantic-color--tier-4': '#fdc000',
		'semantic-color--tier-3': '#f5f5f5',
		'semantic-color--tier-2': '#ff6b1f',
		'semantic-color--tier-1': '#32a042',
	},
	[Theme.DUST]: {
		'core-primary-text': '#040404',
		'core-secondary-text': '#141620',
		'core-tertiary-text': '#0a0a0a',
		'core-primary-bg': '#BEC9E0',
		'core-secondary-bg': '#c9d6f1',
		'core-tertiary-bg': '#9e9db5',

		'semantic-color-idle': '#838ca7',
		'semantic-color-interactive': '#545281',
		'semantic-color-active': '#0a0a0a',
		'semantic-color-disabled': '#7b7a8d',

		'semantic-color-warning-strong': '#fdc000',
		'semantic-color-warning-muted': '#a47b00',
		'semantic-color-error-strong': '#582e34',
		'semantic-color-error-muted': '#1e1012',

		'semantic-color-link-normal': '#f0f0f0',
		'semantic-color-link-hover': 'd0d0d0',
		'semantic-color-link-visited': 'c0c0c0',
		'semantic-color-section-update--bg': '#040404',
		'semantic-color-section-update--text': '#f0f0f0',

		'semantic-color--tier-4': '#fdc000',
		'semantic-color--tier-3': '#f5f5f5',
		'semantic-color--tier-2': '#ff6b1f',
		'semantic-color--tier-1': '#32a042',
	},
};

export const theme = {
	newDark: '#040404', // x30
	newMediumGrey: '#545281', // x20
	superLightGrey: '#BEC9E0', // x20
	black: '#000000', // x19
	superDarkGrey: '#141620', // x12
	white: '#ffffff', // x9
	darkRed: '#1e1012', // x6
	lightGrey: '#9e9db5', // x5
	darkBlue: '#293251', // x4
	newDarkBlue: '#282f44', // x4
	mediumGrey: '#7b7a8d', // x3
	mediumRed: '#582e34', // x2
	lightRed: '#d38893', // x2
	yellow: '#fdc000', // x2
	lightestGreyEver: '#E9E9F5', // x1

	tier4: '#fdc000',
	tier3: '#f5f5f5',
	tier2: '#ff6b1f',
	tier1: '#32a042',

	tier4Muted: '#a47b00', // x2
	tier4Darkened: '#261d01', // x2
};
