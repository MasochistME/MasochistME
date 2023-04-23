import { AvailableLocales, LocaleKey } from 'i18n';

import enUS from './en-US.json';
import teST from './te-ST'; // This is a testing locale

/**
 * This is a custom implementation of i18n.
 */
export class Locale {
  private locale: AvailableLocales;
  private localeMap: Record<AvailableLocales, Record<LocaleKey, string>> = {
    'en-US': enUS,
    'te-ST': teST,
  };

  constructor(locale: AvailableLocales = AvailableLocales['en-US']) {
    this.locale = locale;
  }

  public changeLocale(locale: AvailableLocales) {
    if (this.localeMap[locale]) this.locale = locale;
  }

  public getTranslation(key: LocaleKey) {
    const locale = this.localeMap[this.locale];
    return locale[key];
  }
}
