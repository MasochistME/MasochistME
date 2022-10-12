import express from 'express';
export const routerV1 = express.Router();

import {
  createRace,
  getRaceById,
  updateRaceById,
  deleteRaceById,
  getRaceList,
  getActiveRace,
  getRaceParticipantById,
  joinRaceByParticipantId,
  updateRaceByParticipantId,
  getRaceParticipantsList,
} from './race';
import {
  getBadgesList,
  createBadge,
  getBadgeById,
  updateBadgeById,
  deleteBadgeById,
} from './badges';
import {
  getMemberBadgeList,
  giveBadgeToMemberById,
  revokeBadgeFromMemberById,
} from './memberBadges';
import { getBadgesByGameId } from './games';

/**
 * masochist-api v1
 */

/***************************
 *         MEMBERS         *
 ***************************/

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

routerV1.get('/games/game/:gameId/badges/list', getBadgesByGameId);

/**************************
 *         BADGES         *
 **************************/

routerV1.get('/badges/list', getBadgesList);
routerV1.post('/badges', createBadge);
routerV1.get('/badges/badge/:badgeId', getBadgeById);
routerV1.put('/badges/badge/:badgeId', updateBadgeById);
routerV1.delete('/badges/badge/:badgeId', deleteBadgeById);

/*************************
 *         RACES         *
 *************************/

routerV1.post('/races', createRace);
routerV1.get('/races/race/:raceId', getRaceById);
routerV1.put('/races/race/:raceId', updateRaceById);
routerV1.delete('/races/race/:raceId', deleteRaceById);
routerV1.get('/races/list', getRaceList);
routerV1.get('/races/active', getActiveRace);

/*********************************
 *       RACE PARTICIPANTS       *
 *********************************/

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
