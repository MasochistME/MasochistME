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

type Head<T> = T extends (
	first: infer FirstArgument,
	...args: any[] | never
) => any
	? FirstArgument
	: never;

export class SDK {
	private BASE_URL: string;
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

	public createRace = <T extends typeof createRace>(args: Head<T>) =>
		createRace(args, this.BASE_URL);
	public deleteRaceById = <T extends typeof deleteRaceById>(args: Head<T>) =>
		deleteRaceById(args, this.BASE_URL);
	public updateRaceById = <T extends typeof updateRaceById>(args: Head<T>) =>
		updateRaceById(args, this.BASE_URL);
	public getRaceById = <T extends typeof getRaceById>(args: Head<T>) =>
		getRaceById(args, this.BASE_URL);
	public getRaceList = () => getRaceList(this.BASE_URL);
	public getActiveRace = () => getActiveRace(this.BASE_URL);

	/*********************************
	 *       RACE PARTICIPANTS       *
	 *********************************/

	public getRaceParticipantById = <T extends typeof getRaceParticipantById>(
		args: Head<T>,
	) => getRaceParticipantById(args, this.BASE_URL);
	public getRaceParticipantsList = <T extends typeof getRaceParticipantsList>(
		args: Head<T>,
	) => getRaceParticipantsList(args, this.BASE_URL);
	public joinRaceByParticipantId = <T extends typeof joinRaceByParticipantId>(
		args: Head<T>,
	) => joinRaceByParticipantId(args, this.BASE_URL);
	public updateRaceByParticipantId = <
		T extends typeof updateRaceByParticipantId,
	>(
		args: Head<T>,
	) => updateRaceByParticipantId(args, this.BASE_URL);
}
