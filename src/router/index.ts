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
import {
  getAllBadges,
  addBadge,
  getBadge,
  updateBadge,
  deleteBadge,
  giveBadge,
  takeBadge,
} from './badges';

router.get('/ranking', getRanking);
router.get('/ranking/user/:id', getUserRanking);
router.get('/ranking/game/:id', getGameLeaderboards);
router.get('/ranking/tier/:id', getTierDetails);
router.get('/curator/games', getCuratorGames);
router.get('/users', getUsers);
router.get('/blog', getBlog);
router.post('/events', getEvents);

router.get('/badges', getAllBadges);
router.post('/badges', addBadge);
router.get('/badges/:id', getBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);
router.put('/badges/badge/:badgeid/user/:steamid', giveBadge);
router.delete('/badges/badge/:badgeid/user/:steamid', takeBadge);

router.get('/users/user/:id', getUserDetails);
