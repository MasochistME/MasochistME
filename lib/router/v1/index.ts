import express from 'express';
export const routerV1 = express.Router();

/***************************
 *         MEMBERS         *
 ***************************/

import {
  getMembersList,
  getMemberById,
  updateMemberById,
  getMemberAchievementList,
  getMemberBadgeList,
  getMemberGameList,
  giveBadgeToMemberById,
  revokeBadgeFromMemberById,
} from './members';

routerV1.post('/members/list', getMembersList);
routerV1.get('/members/member/:memberId', getMemberById);
routerV1.put('/members/member/:memberId', updateMemberById);
routerV1.post(
  '/members/member/:memberId/achievements/list',
  getMemberAchievementList,
);
routerV1.post('/members/member/:memberId/badges/list', getMemberBadgeList);
routerV1.post('/members/member/:memberId/games/list', getMemberGameList);
routerV1.post(
  '/members/member/:memberId/badges/badge/:badgeId',
  giveBadgeToMemberById,
);
routerV1.delete(
  '/members/member/:memberId/badges/badge/:badgeId',
  revokeBadgeFromMemberById,
);

/********************************
 *         LEADERBOARDS         *
 ********************************/

import {
  getLeaderboardsList,
  getMemberLeaderboardsPositionById,
} from './leaderboards';

routerV1.post('/leaderboards/list', getLeaderboardsList);
routerV1.get(
  '/leaderboards/member/:memberId',
  getMemberLeaderboardsPositionById,
);

/*************************
 *         GAMES         *
 *************************/

import {
  getGamesList,
  getBadgesByGameIdList,
  getGameCompletionList,
} from './games';

routerV1.post('/games/list', getGamesList);
routerV1.post('/games/game/:gameId/badges/list', getBadgesByGameIdList);
routerV1.post('/games/completion/list', getGameCompletionList);

/**************************
 *         BADGES         *
 **************************/

import {
  getBadgesList,
  createBadge,
  getBadgeById,
  updateBadgeById,
  deleteBadgeById,
} from './badges';

routerV1.post('/badges/list', getBadgesList);
routerV1.post('/badges', createBadge);
routerV1.get('/badges/badge/:badgeId', getBadgeById);
routerV1.put('/badges/badge/:badgeId', updateBadgeById);
routerV1.delete('/badges/badge/:badgeId', deleteBadgeById);

/*************************
 *         EVENTS         *
 *************************/

import { getEventsList, createEvent } from './events';

routerV1.post('/events/list', getEventsList);
routerV1.post('/events', createEvent);

/*************************
 *         TIERS         *
 *************************/

import { getTiersList } from './tiers';

routerV1.post('/tiers/list', getTiersList);

/*************************
 *         RACES         *
 *************************/

import {
  createRace,
  getRaceById,
  updateRaceById,
  deleteRaceById,
  getRaceList,
  getActiveRace,
} from './race';

routerV1.post('/races', createRace);
routerV1.get('/races/race/:raceId', getRaceById);
routerV1.put('/races/race/:raceId', updateRaceById);
routerV1.delete('/races/race/:raceId', deleteRaceById);
routerV1.post('/races/list', getRaceList);
routerV1.get('/races/active', getActiveRace);

/*********************************
 *       RACE PARTICIPANTS       *
 *********************************/

import {
  getRaceParticipantById,
  joinRaceByParticipantId,
  updateRaceByParticipantId,
  getRaceParticipantsList,
} from './racePlayers';

routerV1.get(
  '/races/race/:raceId/participants/participant/:participantId',
  getRaceParticipantById,
);
routerV1.post(
  '/races/race/:raceId/participants/participant/:participantId',
  joinRaceByParticipantId,
);
routerV1.put(
  '/races/race/:raceId/participants/participant/:participantId',
  updateRaceByParticipantId,
);
routerV1.post('/races/race/:raceId/participants/list', getRaceParticipantsList);

/***************************
 *         SEASONS         *
 ***************************/

import { createSeason, updateSeasonById, getSeasonsList } from './seasons';

routerV1.post('/seasons', createSeason);
routerV1.put('/seasons/season/:seasonId', updateSeasonById);
routerV1.post('/seasons/list', getSeasonsList);
