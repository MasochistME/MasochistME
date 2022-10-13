import express from 'express';
export const routerV1 = express.Router();

/***************************
 *         MEMBERS         *
 ***************************/

import {
  getMembersList,
  getMemberById,
  updateMemberById,
  getMemberBadgeList,
  giveBadgeToMemberById,
  revokeBadgeFromMemberById,
} from './members';

routerV1.get('/members/list', getMembersList);
routerV1.get('/members/member/:memberId', getMemberById);
routerV1.put('/members/member/:memberId', updateMemberById);
routerV1.get('/members/member/:memberId/badges/list', getMemberBadgeList);
routerV1.post(
  '/members/member/:memberId/badges/badge/:badgeId',
  giveBadgeToMemberById,
);
routerV1.delete(
  '/members/member/:memberId/badges/badge/:badgeId',
  revokeBadgeFromMemberById,
);

/*************************
 *         GAMES         *
 *************************/

import { getGamesList, getBadgesByGameId } from './games';

routerV1.get('/games/list', getGamesList);
routerV1.get('/games/game/:gameId/badges/list', getBadgesByGameId);

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

routerV1.get('/badges/list', getBadgesList);
routerV1.post('/badges', createBadge);
routerV1.get('/badges/badge/:badgeId', getBadgeById);
routerV1.put('/badges/badge/:badgeId', updateBadgeById);
routerV1.delete('/badges/badge/:badgeId', deleteBadgeById);

/*************************
 *         TIERS         *
 *************************/

import { getTiersList } from './tiers';

routerV1.get('/tiers/list', getTiersList);

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
routerV1.get('/races/list', getRaceList);
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
routerV1.get('/races/race/:raceId/participants/list', getRaceParticipantsList);

/***************************
 *         SEASONS         *
 ***************************/

import {
  createSeason,
  updateSeasonById,
  startSeasonById,
  getActiveSeason,
  endActiveSeason,
  getSeasonsList,
} from './seasons';

routerV1.post('/seasons', createSeason);
routerV1.put('/seasons/season/:seasonId', updateSeasonById);
routerV1.post('/seasons/season/:seasonId', startSeasonById);
routerV1.get('/seasons/active', getActiveSeason);
routerV1.put('/seasons/active', endActiveSeason);
routerV1.post('/seasons/list', getSeasonsList);
