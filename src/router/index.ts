import express from 'express';
export const router = express.Router();

// -----------------------------------------------------------------
// ------------------------------- NEW -----------------------------
// -----------------------------------------------------------------

import { getUsers, getUserDetails } from './users';
import {
  getRanking,
  getUserRanking,
  getGameLeaderboards,
  getTierDetails,
} from './ranking';
import { getCuratorGames } from './curator';
import { getBlog } from './blog';
import { getEvents } from './events';

router.get('/ranking', getRanking);
router.get('/ranking/user/:id', getUserRanking);
router.get('/ranking/game/:id', getGameLeaderboards);
router.get('/ranking/tier/:id', getTierDetails);
router.get('/curator/games', getCuratorGames);
router.get('/users', getUsers);
router.get('/blog', getBlog);
router.post('/events', getEvents);

router.get('/users/user/:id', getUserDetails);

// -----------------------------------------------------------------
// ------------------------------- OLD -----------------------------
// -----------------------------------------------------------------

import { initiateMainUpdate, getStatus } from './old/update';
import { getSteamID, getRating } from './old/special';
import {
  getAllBadges,
  getBadge,
  addBadge,
  updateBadge,
  deleteBadge,
  giveBadge,
  takeBadge,
} from './old/badges';
import {
  getAllPatrons,
  getPatronsByTier,
  getPatron,
  addPatron,
  updatePatron,
  deletePatron,
} from './old/patrons';
import {
  // getCuratorGames,
  getCuratedGamesFromTier,
  updateCuratorGames,
  getCuratorMembers,
} from './old/curator';
import { getAllUsers, getUser, updateUser } from './old/users';

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

// router.get('/curator/games', getCuratorGames);
router.get('/curator/games/tier/:tier', getCuratedGamesFromTier);
router.put('/curator/games', updateCuratorGames);
router.get('/curator/members', getCuratorMembers);

router.get('/members', getAllUsers);
router.get('/member/member/:steamid', getUser);
router.put('/member/member/:steamid', updateUser);

router.get('/update', initiateMainUpdate);
router.get('/status', getStatus);
