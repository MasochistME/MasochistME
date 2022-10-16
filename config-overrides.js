/* eslint-disable @typescript-eslint/no-var-requires */
// const rewireDefinePlugin = require('react-app-rewire-define-plugin');
// const dotenv = require('dotenv');

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
