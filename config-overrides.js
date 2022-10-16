/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = function override(config, env) {
	config.resolve.fallback = {
		...config.resolve.fallback,
		crypto: false,
		fs: false,
		path: false,
		os: false,
	};

	return config;
};
