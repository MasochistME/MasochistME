import { Locale } from './locale';
import enUS from './en-US.json';

type LocaleKeys = keyof typeof enUS;
export enum AvailableLocales {
	'en-US' = 'en-US',
}

let l: Locale;

export const initLocale = () => {
	l = new Locale();
};

export const t = (key: LocaleKeys) => {
	return l.getTranslation(key);
};
