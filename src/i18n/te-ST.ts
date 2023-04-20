import { LocaleKey } from 'i18n';
import enUS from './en-US.json';

const generateTestLocale = () => {
	const teST: Record<LocaleKey, string> = enUS;
	const keys = Object.keys(teST) as LocaleKey[];
	keys.forEach((key: LocaleKey) => {
		teST[key] = '...';
	});
	return teST;
};

const testLocale = generateTestLocale();

export default testLocale;
