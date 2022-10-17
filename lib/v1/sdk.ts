import axios from 'axios';

import { getGamesList, getBadgesByGameIdList } from 'v1/api/games';
import { getTiersList } from 'v1/api/tiers';
import {
	getMembersList,
	getMemberById,
	updateMemberById,
	getMemberBadgeList,
	giveBadgeToMemberById,
	revokeBadgeFromMemberById,
} from 'v1/api/members';
import {
	getBadgesList,
	createBadge,
	getBadgeById,
	updateBadgeById,
	deleteBadgeById,
} from 'v1/api/badges';
import { createEvent, getEventsList } from 'v1/api/events';
import {
	createRace,
	deleteRaceById,
	updateRaceById,
	getRaceById,
	getRaceList,
	getActiveRace,
} from 'v1/api/races';
import {
	getRaceParticipantById,
	getRaceParticipantsList,
	joinRaceByParticipantId,
	updateRaceByParticipantId,
} from 'v1/api/racePlayers';
import {
	createSeason,
	updateSeasonById,
	startSeasonById,
	endSeasonById,
	getSeasonsList,
} from 'v1/api/seasons';
import {
	getLeaderboardsList,
	getMemberLeaderboardsPositionById,
} from './api/leaderboards';

export type Config = {
	host: string; // for example localhost:3000
	authToken?: string;
};

export type Head<T> = T extends (
	first: infer FirstArgument,
	...args: any[] | never
) => any
	? FirstArgument
	: never;

export class SDK {
	private BASE_URL: string;
	constructor(config: Config) {
		this.BASE_URL = `${config.host}/api/v1`;
		if (config.authToken) {
			axios.defaults.headers.common['Authorization'] = config.authToken;
		} else {
			throw new Error('Authorization token is required.');
		}
	}

	/*************************
	 *         GAMES         *
	 *************************/

	public getGamesList = <T extends typeof getGamesList>(args: Head<T>) =>
		getGamesList(args, this.BASE_URL);
	public getBadgesByGameIdList = <T extends typeof getBadgesByGameIdList>(
		args: Head<T>,
	) => getBadgesByGameIdList(args, this.BASE_URL);

	/***************************
	 *         MEMBERS         *
	 ***************************/

	public getMembersList = <T extends typeof getMembersList>(args: Head<T>) =>
		getMembersList(args, this.BASE_URL);
	public getMemberById = <T extends typeof getMemberById>(args: Head<T>) =>
		getMemberById(args, this.BASE_URL);
	public updateMemberById = <T extends typeof updateMemberById>(
		args: Head<T>,
	) => updateMemberById(args, this.BASE_URL);

	/*********************************
	 *         TIERS         *
	 *********************************/

	public getTiersList = <T extends typeof getTiersList>(args: Head<T>) =>
		getTiersList(args, this.BASE_URL);

	/**************************
	 *         BADGES         *
	 **************************/

	public getBadgesList = <T extends typeof getBadgesList>(args: Head<T>) =>
		getBadgesList(args, this.BASE_URL);
	public createBadge = <T extends typeof createBadge>(args: Head<T>) =>
		createBadge(args, this.BASE_URL);
	public getBadgeById = <T extends typeof getBadgeById>(args: Head<T>) =>
		getBadgeById(args, this.BASE_URL);
	public updateBadgeById = <T extends typeof updateBadgeById>(args: Head<T>) =>
		updateBadgeById(args, this.BASE_URL);
	public deleteBadgeById = <T extends typeof deleteBadgeById>(args: Head<T>) =>
		deleteBadgeById(args, this.BASE_URL);

	/*********************************
	 *         MEMBER BADGES         *
	 *********************************/

	public getMemberBadgeList = <T extends typeof getMemberBadgeList>(
		args: Head<T>,
	) => getMemberBadgeList(args, this.BASE_URL);
	public giveBadgeToMemberById = <T extends typeof giveBadgeToMemberById>(
		args: Head<T>,
	) => giveBadgeToMemberById(args, this.BASE_URL);
	public revokeBadgeFromMemberById = <
		T extends typeof revokeBadgeFromMemberById,
	>(
		args: Head<T>,
	) => revokeBadgeFromMemberById(args, this.BASE_URL);

	/**********************
	 *       EVENTS       *
	 *********************/

	public createEvent = <T extends typeof createEvent>(args: Head<T>) =>
		createEvent(args, this.BASE_URL);
	public getEventsList = <T extends typeof getEventsList>(args: Head<T>) =>
		getEventsList(args, this.BASE_URL);

	/*********************
	 *       RACES       *
	 *********************/

	public getRaceList = <T extends typeof getRaceList>(args: Head<T>) =>
		getRaceList(args, this.BASE_URL);
	public createRace = <T extends typeof createRace>(args: Head<T>) =>
		createRace(args, this.BASE_URL);
	public deleteRaceById = <T extends typeof deleteRaceById>(args: Head<T>) =>
		deleteRaceById(args, this.BASE_URL);
	public updateRaceById = <T extends typeof updateRaceById>(args: Head<T>) =>
		updateRaceById(args, this.BASE_URL);
	public getRaceById = <T extends typeof getRaceById>(args: Head<T>) =>
		getRaceById(args, this.BASE_URL);
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

	/***********************
	 *       SEASONS       *
	 ***********************/

	public createSeason = <T extends typeof createSeason>(args: Head<T>) =>
		createSeason(args, this.BASE_URL);
	public updateSeasonById = <T extends typeof updateSeasonById>(
		args: Head<T>,
	) => updateSeasonById(args, this.BASE_URL);
	public startSeasonById = <T extends typeof startSeasonById>(args: Head<T>) =>
		startSeasonById(args, this.BASE_URL);
	public endSeasonById = <T extends typeof endSeasonById>(args: Head<T>) =>
		endSeasonById(args, this.BASE_URL);
	public getSeasonsList = <T extends typeof getSeasonsList>(args: Head<T>) =>
		getSeasonsList(args, this.BASE_URL);

	/****************************
	 *       LEADERBOARDS       *
	 ****************************/

	public getLeaderboardsList = <T extends typeof getLeaderboardsList>(
		args: Head<T>,
	) => getLeaderboardsList(args, this.BASE_URL);
	public getMemberLeaderboardsPositionById = <
		T extends typeof getMemberLeaderboardsPositionById,
	>(
		args: Head<T>,
	) => getMemberLeaderboardsPositionById(args, this.BASE_URL);
}
