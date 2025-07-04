import express from 'express';
import { apiLegacyAuth } from 'helpers/validate';

export const routerLegacy = express.Router();

// -----------------------------------------------------------------
// ------------------------------- NEW -----------------------------
// -----------------------------------------------------------------
import {
    addBadge,
    deleteBadge,
    getAllBadges,
    getBadge,
    giveBadge,
    takeBadge,
    updateBadge,
} from './badges';
import { getBlog } from './blog';
import {
    getCuratedGamesFromTier,
    getCuratorGames,
    getCuratorMembers,
    updateCuratorGames,
} from './curator';
import { getEvents } from './events';
import { connectUserWithDiscord, updateUserFields } from './masochist';
import {
    addPatron,
    deletePatron,
    getAllPatrons,
    getPatron,
    getPatronsByTier,
    updatePatron,
} from './patrons';
import {
    getGameLeaderboards,
    getRanking,
    getTierDetails,
    getUserRanking,
} from './ranking';
import {
    getAllSettings,
    getRating,
    getSetting,
    getSteamID,
    getTabs,
} from './special';
import { getStatus, initiateMainUpdate } from './update';
import { getUserDetails, getUsers, updateUser } from './users';

routerLegacy.get('/special/vanityid/:vanityid', apiLegacyAuth, getSteamID);
routerLegacy.get('/rating', apiLegacyAuth, getRating);

routerLegacy.get('/badges', apiLegacyAuth, getAllBadges);
routerLegacy.post('/badges', apiLegacyAuth, addBadge);
routerLegacy.get('/badges/:id', apiLegacyAuth, getBadge);
routerLegacy.put('/badges/:id', apiLegacyAuth, updateBadge);
routerLegacy.delete('/badges/:id', apiLegacyAuth, deleteBadge);
routerLegacy.put(
  '/badges/badge/:badgeid/user/:steamid',
  apiLegacyAuth,
  giveBadge,
);
routerLegacy.delete(
  '/badges/badge/:badgeid/user/:steamid',
  apiLegacyAuth,
  takeBadge,
);

routerLegacy.get('/patrons', apiLegacyAuth, getAllPatrons);
routerLegacy.get('/patrons/tier/:tier', apiLegacyAuth, getPatronsByTier);
routerLegacy.post(
  '/patrons/tier/:tier/vanityid/:vanityid',
  apiLegacyAuth,
  addPatron,
);
routerLegacy.get('/patrons/patron/:steamid', apiLegacyAuth, getPatron);
routerLegacy.put(
  '/patrons/patron/:steamid/tier/:tier',
  apiLegacyAuth,
  updatePatron,
);
routerLegacy.delete('/patrons/patron/:steamid', apiLegacyAuth, deletePatron);

routerLegacy.get('/curator/games', apiLegacyAuth, getCuratorGames);
routerLegacy.get(
  '/curator/games/tier/:tier',
  apiLegacyAuth,
  getCuratedGamesFromTier,
);
routerLegacy.get('/curator/games/update', apiLegacyAuth, updateCuratorGames);
routerLegacy.get('/curator/members', apiLegacyAuth, getCuratorMembers);

routerLegacy.get('/users', apiLegacyAuth, getUsers);
routerLegacy.get('/users/user/:steamid', apiLegacyAuth, getUserDetails);
routerLegacy.get('/users/user/:steamid/update', apiLegacyAuth, updateUser);
routerLegacy.put(
  '/users/user/:steamid/discord/:discordid',
  apiLegacyAuth,
  connectUserWithDiscord,
);
routerLegacy.put('/users/user/:steamid', apiLegacyAuth, updateUserFields);

routerLegacy.get('/update', apiLegacyAuth, initiateMainUpdate);
routerLegacy.get('/status', apiLegacyAuth, getStatus);

routerLegacy.get('/blog', apiLegacyAuth, getBlog);
routerLegacy.get('/events', apiLegacyAuth, getEvents);

routerLegacy.get('/ranking', apiLegacyAuth, getRanking);
routerLegacy.get('/ranking/user/:id', apiLegacyAuth, getUserRanking);
routerLegacy.get('/ranking/game/:id', apiLegacyAuth, getGameLeaderboards);
routerLegacy.get('/ranking/tier/:id', apiLegacyAuth, getTierDetails);

routerLegacy.get('/settings', apiLegacyAuth, getAllSettings);
routerLegacy.get('/settings/:setting', apiLegacyAuth, getSetting);

routerLegacy.get('/tabs', apiLegacyAuth, getTabs);
