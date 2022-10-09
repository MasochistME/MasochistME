import express from 'express';
export const routerV2 = express.Router();

import {
  createRace,
  getRaceById,
  updateRaceById,
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
routerV2.get('/race/id/:id', getRaceById);
routerV2.put('/race/id/:id', updateRaceById);
routerV2.delete('/race/id/:id', deleteRaceById);
routerV2.get('/race/list', getRaceList);
