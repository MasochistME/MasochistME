import axios from 'axios';

import {
	getGamesList,
	getBadgesByGameIdList,
	getGameCompletionList,
} from 'v1/api/games';
import { getTiersList } from 'v1/api/tiers';
import { getCandidateSummary } from 'v1/api/candidates';
import {
	getMembersList,
	getMemberById,
	updateMemberById,
	getMemberAwardList,
	getMemberBadgeList,
	getMemberGameList,
	getMemberAchievementList,
	giveBadgeToMemberById,
	giveAwardToMemberById,
	revokeBadgeFromMemberById,
	revokeAwardFromMemberById,
} from 'v1/api/members';
import {
	getBadgesList,
	createBadge,
	getBadgeById,
	updateBadgeById,
	deleteBadgeById,
} from 'v1/api/badges';
import {
	getAwardsList,
	createAward,
	getAwardById,
	updateAwardById,
	deleteAwardById,
} from 'v1/api/awards';
import { createLog, getLogList } from 'v1/api/logs';
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
	getSeasonById,
	getSeasonLeaderboardsById,
} from 'v1/api/seasons';
import {
	getLeaderboardsMembersList,
	getLeaderboardsGamesList,
	getMemberLeaderboardsPositionById,
} from './api/leaderboards';
import {
	createFeatured,
	getFeaturedList,
	updateFeaturedById,
	deleteFeaturedById,
} from './api/featured';
import {
	createPatron,
	getPatronsList,
	updatePatronById,
	getPatreonTierList,
} from './api/patrons';
import { updateMember, getUpdateStatus } from './api/update';

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

	public getUpdateStatus = () => getUpdateStatus(this.BASE_URL);

	/*************************
	 *         GAMES         *
	 *************************/

	public getGamesList = <T extends typeof getGamesList>(args: Head<T>) =>
		getGamesList(args, this.BASE_URL);
	public getBadgesByGameIdList = <T extends typeof getBadgesByGameIdList>(
		args: Head<T>,
	) => getBadgesByGameIdList(args, this.BASE_URL);
	public getGameCompletionList = <T extends typeof getGameCompletionList>(
		args: Head<T>,
	) => getGameCompletionList(args, this.BASE_URL);

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
	public getMemberGameList = <T extends typeof getMemberGameList>(
		args: Head<T>,
	) => getMemberGameList(args, this.BASE_URL);
	public getMemberAchievementList = <T extends typeof getMemberAchievementList>(
		args: Head<T>,
	) => getMemberAchievementList(args, this.BASE_URL);
	public updateMember = <T extends typeof updateMember>(args: Head<T>) =>
		updateMember(args, this.BASE_URL);

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

	/**************************
	 *         AWARDS         *
	 **************************/

	public getAwardsList = <T extends typeof getAwardsList>(args: Head<T>) =>
		getAwardsList(args, this.BASE_URL);
	public createAwardB = <T extends typeof createAward>(args: Head<T>) =>
		createAward(args, this.BASE_URL);
	public getAwardBById = <T extends typeof getAwardById>(args: Head<T>) =>
		getAwardById(args, this.BASE_URL);
	public updateAwardBById = <T extends typeof updateAwardById>(args: Head<T>) =>
		updateAwardById(args, this.BASE_URL);
	public deleteAwardBById = <T extends typeof deleteAwardById>(args: Head<T>) =>
		deleteAwardById(args, this.BASE_URL);

	/*********************************
	 *         MEMBER AWARDS         *
	 *********************************/

	public getMemberAwardList = <T extends typeof getMemberAwardList>(
		args: Head<T>,
	) => getMemberAwardList(args, this.BASE_URL);
	public giveAwardToMemberById = <T extends typeof giveAwardToMemberById>(
		args: Head<T>,
	) => giveAwardToMemberById(args, this.BASE_URL);
	public revokeAwardFromMemberById = <
		T extends typeof revokeAwardFromMemberById,
	>(
		args: Head<T>,
	) => revokeAwardFromMemberById(args, this.BASE_URL);

	/********************
	 *       LOGS       *
	 *******************/

	public createLog = <T extends typeof createLog>(args: Head<T>) =>
		createLog(args, this.BASE_URL);
	public getLogList = <T extends typeof getLogList>(args: Head<T>) =>
		getLogList(args, this.BASE_URL);

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
	public getSeasonById = <T extends typeof getSeasonById>(args: Head<T>) =>
		getSeasonById(args, this.BASE_URL);
	public updateSeasonById = <T extends typeof updateSeasonById>(
		args: Head<T>,
	) => updateSeasonById(args, this.BASE_URL);
	public startSeasonById = <T extends typeof startSeasonById>(args: Head<T>) =>
		startSeasonById(args, this.BASE_URL);
	public endSeasonById = <T extends typeof endSeasonById>(args: Head<T>) =>
		endSeasonById(args, this.BASE_URL);
	public getSeasonsList = <T extends typeof getSeasonsList>(args: Head<T>) =>
		getSeasonsList(args, this.BASE_URL);
	public getSeasonLeaderboardsById = <
		T extends typeof getSeasonLeaderboardsById,
	>(
		args: Head<T>,
	) => getSeasonLeaderboardsById(args, this.BASE_URL);

	/****************************
	 *       LEADERBOARDS       *
	 ****************************/

	public getLeaderboardsMembersList = <
		T extends typeof getLeaderboardsMembersList,
	>(
		args: Head<T>,
	) => getLeaderboardsMembersList(args, this.BASE_URL);
	public getLeaderboardsGamesList = <T extends typeof getLeaderboardsGamesList>(
		args: Head<T>,
	) => getLeaderboardsGamesList(args, this.BASE_URL);

	public getMemberLeaderboardsPositionById = <
		T extends typeof getMemberLeaderboardsPositionById,
	>(
		args: Head<T>,
	) => getMemberLeaderboardsPositionById(args, this.BASE_URL);

	/************************
	 *       FEATURED       *
	 ************************/

	public createFeatured = <T extends typeof createFeatured>(args: Head<T>) =>
		createFeatured(args, this.BASE_URL);
	public getFeaturedList = <T extends typeof getFeaturedList>(args: Head<T>) =>
		getFeaturedList(args, this.BASE_URL);
	public updateFeaturedById = <T extends typeof updateFeaturedById>(
		args: Head<T>,
	) => updateFeaturedById(args, this.BASE_URL);
	public deleteFeaturedById = <T extends typeof deleteFeaturedById>(
		args: Head<T>,
	) => deleteFeaturedById(args, this.BASE_URL);

	/***********************
	 *       PATRONS       *
	 ***********************/

	public createPatron = <T extends typeof createPatron>(args: Head<T>) =>
		createPatron(args, this.BASE_URL);
	public getPatronsList = <T extends typeof getPatronsList>(args: Head<T>) =>
		getPatronsList(args, this.BASE_URL);
	public updatePatronById = <T extends typeof updatePatronById>(
		args: Head<T>,
	) => updatePatronById(args, this.BASE_URL);
	public getPatreonTierList = () => getPatreonTierList(this.BASE_URL);

	/**************************
	 *       CANDIDATES       *
	 **************************/

	public getCandidateSummary = <T extends typeof getCandidateSummary>(
		args: Head<T>,
	) => getCandidateSummary(args, this.BASE_URL);
}
