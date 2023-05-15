/* eslint-disable no-console */
export const log = {
	INFO: (content: string): unknown => {
		console.log(`${new Date().toLocaleString()} - [INFO] - ${content}`);
		return;
	},
	WARN: (content: string): unknown => {
		console.trace(`${new Date().toLocaleString()} - [WARN] - ${content}`);
		return;
	},
	DEBUG: (content: string): unknown => {
		console.log(`${new Date().toLocaleString()} - [DEBUG] - ${content}`);
		return;
	},
};
