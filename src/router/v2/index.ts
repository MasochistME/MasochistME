import express from 'express';
export const routerV2 = express.Router();

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

/*************************
 *         RACES         *
 *************************/
routerV2.post('/race', createRace);
routerV2.get('/race/id/:raceId', getRaceById);
routerV2.put('/race/id/:raceId', editRaceById);
routerV2.delete('/race/id/:raceId', deleteRaceById);
routerV2.get('/race/list', getRaceList);
