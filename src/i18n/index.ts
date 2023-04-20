import { Locale } from './locale';
import enUS from './en-US.json';

export type LocaleKey = keyof typeof enUS;
export enum AvailableLocales {
	'en-US' = 'en-US',
}

let l: Locale;

export const initLocale = () => {
	if (!l) l = new Locale();
};

export const t = (key: LocaleKey) => {
	return l.getTranslation(key);
};
