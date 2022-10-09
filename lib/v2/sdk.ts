import axios from 'axios';

import {
	createRace,
	deleteRaceById,
	updateRaceById,
	getRaceById,
	getRaceList,
	getActiveRace,
	getRaceParticipantById,
	getRaceParticipantsList,
	joinRaceByParticipantId,
	updateRaceByParticipantId,
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
	public updateRaceById = <typeof updateRaceById>this.setUrl(updateRaceById);
	public getRaceById = <typeof getRaceById>this.setUrl(getRaceById);
	public getRaceList = <typeof getRaceList>this.setUrl(getRaceList);
	public getActiveRace = <typeof getActiveRace>this.setUrl(getActiveRace);

	/*********************************
	 *       RACE PARTICIPANTS       *
	 *********************************/

	public getRaceParticipantById = <typeof getRaceParticipantById>(
		this.setUrl(getRaceParticipantById)
	);
	public getRaceParticipantsList = <typeof getRaceParticipantsList>(
		this.setUrl(getRaceParticipantsList)
	);
	public joinRaceByParticipantId = <typeof joinRaceByParticipantId>(
		this.setUrl(joinRaceByParticipantId)
	);
	public updateRaceByParticipantId = <typeof updateRaceByParticipantId>(
		this.setUrl(updateRaceByParticipantId)
	);
}
