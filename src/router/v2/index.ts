import express from 'express';
export const routerv2 = express.Router();

import {
  createRace,
  getRaceById,
  editRaceById,
  deleteRaceById,
  getRaceList,
} from './race';

/**
 * masochist-api v2
 */

const VERSIONING = '/v2';

/*************************
 *         RACES         *
 *************************/
routerv2.post(`${VERSIONING}/race`, createRace);
routerv2.get(`${VERSIONING}/race/id/:raceId`, getRaceById);
routerv2.put(`${VERSIONING}/race/id/:raceId`, editRaceById);
routerv2.delete(`${VERSIONING}/race/id/:raceId`, deleteRaceById);
routerv2.get(`${VERSIONING}/race/list`, getRaceList);
