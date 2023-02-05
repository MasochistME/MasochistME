import mixpanel from 'mixpanel-browser';
import config from 'config.json';

let USE_MIXPANEL = false;
// @ts-ignore
if (config.MIXPANEL_TOKEN) {
	// @ts-ignore
	mixpanel.init(config.MIXPANEL_TOKEN, { debug: false });
	USE_MIXPANEL = true;
}

export const useMixpanel = () => {
	const track = (event: string, params = {}) => {
		if (USE_MIXPANEL) mixpanel.track(event, params);
	};

	const trackLink = (domId: string, event: string, params = {}) => {
		if (USE_MIXPANEL) mixpanel.track_links(domId, event, params);
	};

	return { track, trackLink };
};
