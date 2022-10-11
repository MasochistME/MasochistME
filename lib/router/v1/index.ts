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
  giveBadgeToUserById,
  revokeBadgeFromUserById,
} from './badges';

/**
 * masochist-api v1
 */

/*************************
 *         GAMES         *
 *************************/

routerV1.get('/game/:gameid/badges', getRaceById);

/**************************
 *         BADGES         *
 **************************/

routerV1.get('/badges/list', getBadgesList);
routerV1.post('/badges', createBadge);
routerV1.get('/badges/badge/:badgeid', getBadgeById);
routerV1.put('/badges/badge/:badgeid', updateBadgeById);
routerV1.delete('/badges/badge/:badgeid', deleteBadgeById);

routerV1.post('/badges/badge/:badgeid/user/:userid', giveBadgeToUserById);
routerV1.delete('/badges/badge/:badgeid/user/:userid', revokeBadgeFromUserById);

/*************************
 *         RACES         *
 *************************/

routerV1.post('/race', createRace);
routerV1.get('/race/id/:id', getRaceById);
routerV1.put('/race/id/:id', updateRaceById);
routerV1.delete('/race/id/:id', deleteRaceById);
routerV1.get('/race/list', getRaceList);
routerV1.get('/race/active', getActiveRace);

routerV1.get(
  '/race/:raceid/participant/:participantid',
  getRaceParticipantById,
);
routerV1.post(
  '/race/:raceid/participant/:participantid',
  joinRaceByParticipantId,
);
routerV1.put(
  '/race/:raceid/participant/:participantid',
  updateRaceByParticipantId,
);
routerV1.get('/race/:raceid/participants/list', getRaceParticipantsList);
