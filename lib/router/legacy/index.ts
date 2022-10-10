import express from 'express';
export const routerLegacy = express.Router();

// -----------------------------------------------------------------
// ------------------------------- NEW -----------------------------
// -----------------------------------------------------------------

import { initiateMainUpdate, getStatus } from './update';
import { getUsers, getUserDetails, updateUser } from './users';
import { connectUserWithDiscord, updateUserFields } from './masochist';
import {
  getAllBadges,
  addBadge,
  getBadge,
  updateBadge,
  deleteBadge,
  giveBadge,
  takeBadge,
} from './badges';
import {
  getAllPatrons,
  getPatronsByTier,
  getPatron,
  addPatron,
  updatePatron,
  deletePatron,
} from './patrons';
import {
  getRanking,
  getUserRanking,
  getGameLeaderboards,
  getTierDetails,
} from './ranking';
import {
  getCuratorGames,
  getCuratedGamesFromTier,
  updateCuratorGames,
  getCuratorMembers,
} from './curator';
import { getBlog } from './blog';
import { getEvents } from './events';
import {
  getSteamID,
  getRating,
  getAllSettings,
  getSetting,
  getTabs,
} from './special';

routerLegacy.get('/special/vanityid/:vanityid', getSteamID);
routerLegacy.get('/rating', getRating);

routerLegacy.get('/badges', getAllBadges);
routerLegacy.post('/badges', addBadge);
routerLegacy.get('/badges/:id', getBadge);
routerLegacy.put('/badges/:id', updateBadge);
routerLegacy.delete('/badges/:id', deleteBadge);
routerLegacy.put('/badges/badge/:badgeid/user/:steamid', giveBadge);
routerLegacy.delete('/badges/badge/:badgeid/user/:steamid', takeBadge);

routerLegacy.get('/patrons', getAllPatrons);
routerLegacy.get('/patrons/tier/:tier', getPatronsByTier);
routerLegacy.post('/patrons/tier/:tier/vanityid/:vanityid', addPatron);
routerLegacy.get('/patrons/patron/:steamid', getPatron);
routerLegacy.put('/patrons/patron/:steamid/tier/:tier', updatePatron);
routerLegacy.delete('/patrons/patron/:steamid', deletePatron);

routerLegacy.get('/curator/games', getCuratorGames);
routerLegacy.get('/curator/games/tier/:tier', getCuratedGamesFromTier);
routerLegacy.get('/curator/games/update', updateCuratorGames);
routerLegacy.get('/curator/members', getCuratorMembers);

routerLegacy.get('/users', getUsers);
routerLegacy.get('/users/user/:steamid', getUserDetails);
routerLegacy.get('/users/user/:steamid/update', updateUser);
routerLegacy.put(
  '/users/user/:steamid/discord/:discordid',
  connectUserWithDiscord,
);
routerLegacy.put('/users/user/:steamid', updateUserFields);

routerLegacy.get('/update', initiateMainUpdate);
routerLegacy.get('/status', getStatus);

routerLegacy.get('/blog', getBlog);
routerLegacy.get('/events', getEvents);

routerLegacy.get('/ranking', getRanking);
routerLegacy.get('/ranking/user/:id', getUserRanking);
routerLegacy.get('/ranking/game/:id', getGameLeaderboards);
routerLegacy.get('/ranking/tier/:id', getTierDetails);

routerLegacy.get('/settings', getAllSettings);
routerLegacy.get('/settings/:setting', getSetting);

routerLegacy.get('/tabs', getTabs);
