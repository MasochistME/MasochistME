const USE_MIXPANEL = false;

// This file is a testament to when Mixpanel was used.
// Might be reused in the future with the self-hosted statistics service

export const useMixpanel = () => {
  // @ts-ignore
  const track = (event: string, params = {}) => {
    if (USE_MIXPANEL) {
      // mixpanel.track(event, params);
    }
  };

  // @ts-ignore
  const trackLink = (domId: string, event: string, params = {}) => {
    if (USE_MIXPANEL) {
      // mixpanel.track_links(domId, event, params);
    }
  };

  return { track, trackLink };
};
