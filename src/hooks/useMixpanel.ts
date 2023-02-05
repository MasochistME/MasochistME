import mixpanel from 'mixpanel-browser';
import config from 'config.json';

mixpanel.init(config.MIXPANEL_TOKEN, { debug: false });

export const useMixpanel = () => {
	const track = (event: string, params = {}) => {
		mixpanel.track(event, params);
	};

	const trackLink = (domId: string, event: string, params = {}) => {
		mixpanel.track_links(domId, event, params);
	};

	return { track, trackLink };
};
