/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = function override(config, env) {
	config.resolve = {
		...config.resolve,
		fallback: {
			...config.resolve.fallback,
			crypto: false,
			fs: false,
			path: false,
			os: false,
		},
		alias: {
			...config.resolve.alias,
			'@mui/styled-engine': '@mui/styled-engine-sc',
		},
	};
	return config;
};
