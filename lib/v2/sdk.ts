import axios from 'axios';

import {
	createRace,
	deleteRaceById,
	editRaceById,
	getRaceById,
	getRaceList,
} from 'v2/api/race';

export type Config = {
	host: string; // for example localhost:3000
	authToken?: string;
};

export class SDK {
	private BASE_URL: string;
	private setUrl =
		<T>(fn: (args: T) => any) =>
		async (...args: Parameters<typeof fn>) =>
			(await fn(...args))(this.BASE_URL);

	constructor(config: Config) {
		this.BASE_URL = `${config.host}/api/v2`;
		if (config.authToken) {
			axios.defaults.headers.common['Authorization'] = config.authToken;
		} else {
			throw new Error('Authorization token is required.');
		}
	}

	/*********************
	 *       RACES       *
	 *********************/
	public createRace = <typeof createRace>this.setUrl(createRace);
	public deleteRaceById = <typeof deleteRaceById>this.setUrl(deleteRaceById);
	public editRaceById = <typeof editRaceById>this.setUrl(editRaceById);
	public getRaceById = <typeof getRaceById>this.setUrl(getRaceById);
	public getRaceList = <typeof getRaceList>this.setUrl(getRaceList);
}
