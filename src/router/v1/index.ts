import express from 'express';
export const router = express.Router();

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

router.get('/special/vanityid/:vanityid', getSteamID);
router.get('/rating', getRating);

router.get('/badges', getAllBadges);
router.post('/badges', addBadge);
router.get('/badges/:id', getBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);
router.put('/badges/badge/:badgeid/user/:steamid', giveBadge);
router.delete('/badges/badge/:badgeid/user/:steamid', takeBadge);

router.get('/patrons', getAllPatrons);
router.get('/patrons/tier/:tier', getPatronsByTier);
router.post('/patrons/tier/:tier/vanityid/:vanityid', addPatron);
router.get('/patrons/patron/:steamid', getPatron);
router.put('/patrons/patron/:steamid/tier/:tier', updatePatron);
router.delete('/patrons/patron/:steamid', deletePatron);

router.get('/curator/games', getCuratorGames);
router.get('/curator/games/tier/:tier', getCuratedGamesFromTier);
router.get('/curator/games/update', updateCuratorGames);
router.get('/curator/members', getCuratorMembers);

router.get('/users', getUsers);
router.get('/users/user/:steamid', getUserDetails);
router.get('/users/user/:steamid/update', updateUser);
router.put('/users/user/:steamid/discord/:discordid', connectUserWithDiscord);
router.put('/users/user/:steamid', updateUserFields);

router.get('/update', initiateMainUpdate);
router.get('/status', getStatus);

router.get('/blog', getBlog);
router.get('/events', getEvents);

router.get('/ranking', getRanking);
router.get('/ranking/user/:id', getUserRanking);
router.get('/ranking/game/:id', getGameLeaderboards);
router.get('/ranking/tier/:id', getTierDetails);

router.get('/settings', getAllSettings);
router.get('/settings/:setting', getSetting);

router.get('/tabs', getTabs);
