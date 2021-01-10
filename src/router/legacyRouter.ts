import express from 'express';
export const legacy = express.Router();

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
  getCuratorGames,
  getCuratedGamesFromTier,
  updateCuratorGames,
  getCuratorMembers,
} from './old/curator';
import { getAllUsers, getUser, updateUser } from './old/users';

legacy.get('/special/vanityid/:vanityid', getSteamID);
legacy.get('/rating', getRating);

legacy.get('/badges', getAllBadges);
legacy.post('/badges', addBadge);
legacy.get('/badges/:id', getBadge);
legacy.put('/badges/:id', updateBadge);
legacy.delete('/badges/:id', deleteBadge);
legacy.put('/badges/badge/:badgeid/user/:steamid', giveBadge);
legacy.delete('/badges/badge/:badgeid/user/:steamid', takeBadge);

legacy.get('/patrons', getAllPatrons);
legacy.get('/patrons/tier/:tier', getPatronsByTier);
legacy.post('/patrons/tier/:tier/vanityid/:vanityid', addPatron);
legacy.get('/patrons/patron/:steamid', getPatron);
legacy.put('/patrons/patron/:steamid/tier/:tier', updatePatron);
legacy.delete('/patrons/patron/:steamid', deletePatron);

legacy.get('/curator/games', getCuratorGames);
legacy.get('/curator/games/tier/:tier', getCuratedGamesFromTier);
legacy.put('/curator/games', updateCuratorGames);
legacy.get('/curator/members', getCuratorMembers);

legacy.get('/members', getAllUsers);
legacy.get('/member/member/:steamid', getUser);
legacy.put('/member/member/:steamid', updateUser);

legacy.get('/update', initiateMainUpdate);
legacy.get('/status', getStatus);
