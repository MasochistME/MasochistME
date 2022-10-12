import express from 'express';
export const routerV1 = express.Router();

import { getGamesList, getBadgesByGameId } from './games';
import {
  getMembersList,
  getMemberById,
  updateMemberById,
  getMemberBadgeList,
  giveBadgeToMemberById,
  revokeBadgeFromMemberById,
} from './members';
import {
  createRace,
  getRaceById,
  updateRaceById,
  deleteRaceById,
  getRaceList,
  getActiveRace,
} from './race';
import {
  getRaceParticipantById,
  joinRaceByParticipantId,
  updateRaceByParticipantId,
  getRaceParticipantsList,
} from './racePlayers';
import {
  getBadgesList,
  createBadge,
  getBadgeById,
  updateBadgeById,
  deleteBadgeById,
} from './badges';

/***************************
 *         MEMBERS         *
 ***************************/

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

routerV1.get('/games/list', getGamesList);
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
