import { Theme } from './theme';

type ColorTokensCommon = {
	'common-color--black': string;
	'common-color--white': string;
	'common-color--red': string;
	'common-color--shadow': string;
	'common-color--light': string;
};

export interface ColorTokens extends ColorTokensCommon {
	'core-primary-bg': string; // newDark
	'core-secondary-bg': string; //superDarkGrey
	'core-tertiary-bg': string; // black
	'core-extra-bg': string; // darkBlue
	'core-primary-text': string; //superLightGrey
	'core-secondary-text': string; // lightGrey
	'core-tertiary-text': string; // white

	'semantic-color--tier-4': string;
	'semantic-color--tier-4--muted': string;
	'semantic-color--tier-3': string;
	'semantic-color--tier-3--muted': string;
	'semantic-color--tier-2': string;
	'semantic-color--tier-2--muted': string;
	'semantic-color--tier-1': string;
	'semantic-color--tier-1--muted': string;

	'semantic-color--idle': string; // newDarkBlue
	'semantic-color--interactive': string; // newMediumGrey
	'semantic-color--active': string; // white
	'semantic-color--disabled': string; // mediumGrey

	'semantic-color--success': string; // green? TODO
	'semantic-color--success-strong': string; // green? TODO
	'semantic-color--success-muted': string; // green? TODO
	'semantic-color--warning': string; // yellow
	'semantic-color--warning-strong': string; // yellow
	'semantic-color--warning-muted': string; // tier4muted
	'semantic-color--error': string; // mediumred
	'semantic-color--error-strong': string; // mediumred
	'semantic-color--error-muted': string; // darkred

	'semantic-color--progress--track': string;
	'semantic-color--progress--thumb': string;

	'semantic-color--link-normal': string;
	'semantic-color--link-hover': string;
	'semantic-color--link-visited': string;
	'semantic-color--link-muted': string;
	'semantic-color--section-update--bg': string; // Color of the "Last updated" section in Subheader.
	'semantic-color--section-update--text': string; // Color of the "Last updated" section in Subheader.

	'semantic-color--switch-track': string;
	'semantic-color--switch-thumb': string;
	'semantic-color--switch-track--checked': string;
	'semantic-color--switch-thumb--checked': string;
	'semantic-color--switch-track--disabled': string;
	'semantic-color--switch-thumb--disabled': string;

	'element-color--header-bg': string;
	'element-color--header-text': string;

	'element-color--button-bg': string;
	'element-color--button-text': string;
	'element-color--button-border': string;
}

const commonColors = {
	'common-color--black': '#040404',
	'common-color--white': '#f0f0f0',
	'common-color--red': '#ff0000',
	'common-color--shadow': '#141414',
	'common-color--light': '#e0e0e0',
};

export const colors: Record<Theme, ColorTokens> = {
	[Theme.ASH]: {
		...commonColors,
		'core-primary-bg': '#040404',
		'core-secondary-bg': '#141620',
		'core-tertiary-bg': '#0a0a0a',
		'core-extra-bg': '#293251',
		'core-primary-text': '#BEC9E0',
		'core-secondary-text': '#9e9db5',
		'core-tertiary-text': '#f0f0f0',

		'semantic-color--tier-4': '#fdc000',
		'semantic-color--tier-4--muted': '#8e6c00',
		'semantic-color--tier-3': '#f5f5f5',
		'semantic-color--tier-3--muted': '#979797',
		'semantic-color--tier-2': '#ff6b1f',
		'semantic-color--tier-2--muted': '#a14719',
		'semantic-color--tier-1': '#32a042',
		'semantic-color--tier-1--muted': '#184e20',

		'semantic-color--idle': '#282f44',
		'semantic-color--interactive': '#545281',
		'semantic-color--active': '#9895db',
		'semantic-color--disabled': '#7b7a8d',

		// TODO - START
		'semantic-color--success': '#62ad3e',
		'semantic-color--success-strong': '#335621',
		'semantic-color--success-muted': '#546c48',
		// TODO - END
		'semantic-color--warning': '#fdc000',
		'semantic-color--warning-strong': '#fdc000',
		'semantic-color--warning-muted': '#a47b00',
		'semantic-color--error': '#9b091e',
		'semantic-color--error-strong': '#d38893',
		'semantic-color--error-muted': '#1e1012',

		'semantic-color--progress--track': '#040404',
		'semantic-color--progress--thumb': '#545281',

		'semantic-color--link-normal': '#f0f0f0',
		'semantic-color--link-hover': 'd0d0d0',
		'semantic-color--link-visited': 'c0c0c0',
		'semantic-color--link-muted': 'afafaf',
		'semantic-color--section-update--bg': '#040404',
		'semantic-color--section-update--text': '#f0f0f0',

		'semantic-color--switch-track': '#545281',
		'semantic-color--switch-thumb': '#f0f0f0',
		'semantic-color--switch-track--checked': '#BEC9E0',
		'semantic-color--switch-thumb--checked': '#f0f0f0',
		'semantic-color--switch-track--disabled': '#7b7a8d',
		'semantic-color--switch-thumb--disabled': '#f0f0f0',

		'element-color--header-bg': '#040404',
		'element-color--header-text': '#BEC9E0',

		'element-color--button-bg': '#0a0a0a',
		'element-color--button-text': '#9e9db5',
		'element-color--button-border': '#545281',
	},
	[Theme.MEAT]: {
		...commonColors,
		'core-primary-bg': '#862020',
		'core-secondary-bg': '#5f1919',
		'core-tertiary-bg': '#501414',
		'core-extra-bg': '#512929',
		'core-primary-text': '#ffe7e7',
		'core-secondary-text': '#f6a593',
		'core-tertiary-text': '#fffef4',

		'semantic-color--tier-4': '#ffe148',
		'semantic-color--tier-4--muted': '#a58214',
		'semantic-color--tier-3': '#f5f5f5',
		'semantic-color--tier-3--muted': '#979797',
		'semantic-color--tier-2': '#ff6b1f',
		'semantic-color--tier-2--muted': '#a14719',
		'semantic-color--tier-1': '#32a042',
		'semantic-color--tier-1--muted': '#184e20',

		'semantic-color--idle': '#2e0a0a',
		'semantic-color--interactive': '#541717',
		'semantic-color--active': '#ffa5a5',
		'semantic-color--disabled': '#7b7a8d',

		// TODO - START
		'semantic-color--success': '#ff67b4',
		'semantic-color--success-strong': '#cb2578',
		'semantic-color--success-muted': '#b76c91',
		// TODO - END
		'semantic-color--warning': '#fdc000',
		'semantic-color--warning-strong': '#fdc000',
		'semantic-color--warning-muted': '#a47b00',
		'semantic-color--error': '#582e34',
		'semantic-color--error-strong': '#d38893',
		'semantic-color--error-muted': '#1e1012',

		'semantic-color--progress--track': '#2e0a0a',
		'semantic-color--progress--thumb': '#890000',

		'semantic-color--link-normal': '#f0f0f0',
		'semantic-color--link-hover': 'd0d0d0',
		'semantic-color--link-visited': 'c0c0c0',
		'semantic-color--link-muted': 'afafaf',
		'semantic-color--section-update--bg': '#b2052f',
		'semantic-color--section-update--text': '#fadcd2',

		'semantic-color--switch-track': '#320303',
		'semantic-color--switch-thumb': '#f0f0f0',
		'semantic-color--switch-track--checked': '#7e5252',
		'semantic-color--switch-thumb--checked': '#f0f0f0',
		'semantic-color--switch-track--disabled': '#7b7a8d',
		'semantic-color--switch-thumb--disabled': '#f0f0f0',

		'element-color--header-bg': '#4e1414',
		'element-color--header-text': '#fedfd6',

		'element-color--button-bg': '#9d3737',
		'element-color--button-text': '#ffe7e7',
		'element-color--button-border': '#ec2e2e',
	},
	[Theme.DUST]: {
		...commonColors,
		'core-primary-text': '#040404',
		'core-secondary-text': '#141620',
		'core-tertiary-text': '#0a0a0a',
		'core-extra-bg': '#91a0bb;',
		'core-primary-bg': '#BEC9E0',
		'core-secondary-bg': '#c9d6f1',
		'core-tertiary-bg': '#9e9db5',

		'semantic-color--tier-4': '#fdc000',
		'semantic-color--tier-4--muted': '#684f00',
		'semantic-color--tier-3': '#f5f5f5',
		'semantic-color--tier-3--muted': '#979797',
		'semantic-color--tier-2': '#ff6b1f',
		'semantic-color--tier-2--muted': '#a14719',
		'semantic-color--tier-1': '#32a042',
		'semantic-color--tier-1--muted': '#184e20',

		'semantic-color--idle': '#838ca7',
		'semantic-color--interactive': '#545281',
		'semantic-color--active': '#0a0a0a',
		'semantic-color--disabled': '#7b7a8d',

		// TODO - START
		'semantic-color--success': '#62ad3e',
		'semantic-color--success-strong': '#335621',
		'semantic-color--success-muted': '#546c48',
		// TODO - END
		'semantic-color--warning': '#fdc000',
		'semantic-color--warning-strong': '#fdc000',
		'semantic-color--warning-muted': '#a47b00',
		'semantic-color--error': '#582e34',
		'semantic-color--error-strong': '#d38893',
		'semantic-color--error-muted': '#1e1012',

		'semantic-color--progress--track': '#2e0a0a',
		'semantic-color--progress--thumb': '#890000',

		'semantic-color--link-normal': '#11366e',
		'semantic-color--link-hover': '11366e',
		'semantic-color--link-visited': '11186e',
		'semantic-color--link-muted': 'afafaf',
		'semantic-color--section-update--bg': '#040404',
		'semantic-color--section-update--text': '#f0f0f0',

		'semantic-color--switch-track': '#545281',
		'semantic-color--switch-thumb': '#f0f0f0',
		'semantic-color--switch-track--checked': '#BEC9E0',
		'semantic-color--switch-thumb--checked': '#f0f0f0',
		'semantic-color--switch-track--disabled': '#7b7a8d',
		'semantic-color--switch-thumb--disabled': '#f0f0f0',

		'element-color--header-bg': '#BEC9E0',
		'element-color--header-text': '#040404',

		'element-color--button-bg': '#9e9db5',
		'element-color--button-text': '#141620',
		'element-color--button-border': '#545281',
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
