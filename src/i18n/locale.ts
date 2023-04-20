import { AvailableLocales } from 'i18n';
import enUS from './en-US.json';

/**
 * This is a custom implementation of i18n.
 */
export class Locale {
	private locale: AvailableLocales;
	private localeMap: Record<AvailableLocales, Record<string, string>> = {
		'en-US': enUS,
	};

	constructor(locale: AvailableLocales = AvailableLocales['en-US']) {
		this.locale = locale;
	}

	public changeLocale(locale: AvailableLocales) {
		if (this.localeMap[locale]) this.locale = locale;
	}

	public getTranslation(key: string) {
		const locale = this.localeMap[this.locale];
		return locale[key];
	}
}
