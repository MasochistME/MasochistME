import mixpanel from 'mixpanel-browser';
import config from 'config.json';

mixpanel.init(config.MIXPANEL_TOKEN, { debug: false });

export enum Track {
	TAB = 'tab.',
}

export const useMixpanel = () => {
	const track = (event: string) => {
		mixpanel.track(event);
	};

	const trackLink = (domId: string, event: string) => {
		mixpanel.track_links(domId, event);
	};

	return { track, trackLink };
};
