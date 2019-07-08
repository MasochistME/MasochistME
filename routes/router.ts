import express from 'express';
export const router = express.Router();

import { initiateMainUpdate } from './update';
import { getSteamID, getRating } from './special';
import { getAllBadges, getBadge, addBadge, updateBadge, deleteBadge, giveBadge } from './badges';
import { getAllPatrons, getPatronsByTier, getPatron, addPatron, updatePatron, deletePatron } from './patrons';
import { getCuratorGames, getCuratedGamesFromTier, updateCuratorGames, getCuratorMembers } from './curator';
import { getAllUsers, getUser, updateUser } from './users';
import { getAllBlogEntries } from './blog';
import { getEvents } from './events';

router.get('/special/vanityid/:vanityid', getSteamID);
router.get('/special/rating', getRating);

router.get('/badges', getAllBadges);
router.post('/badges', addBadge);
router.get('/badges/:id', getBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);
router.put('/badges/badge/:badgeid/user/:steamid', giveBadge);
// TODO take badge from user

router.get('/patrons', getAllPatrons);
router.get('/patrons/tier/:tier', getPatronsByTier);
router.post('/patrons/tier/:tier/vanityid/:vanityid', addPatron);
router.get('/patrons/patron/:steamid', getPatron);
router.put('/patrons/patron/:steamid/tier/:tier', updatePatron);
router.delete('/patrons/patron/:steamid', deletePatron);

router.get('/curator/games', getCuratorGames);
router.get('/curator/games/tier/:tier', getCuratedGamesFromTier);
router.put('/curator/games', updateCuratorGames);
router.get('/curator/members', getCuratorMembers);

router.get('/users', getAllUsers);
router.get('/users/user/:steamid', getUser);
router.put('/users/user/:steamid', updateUser);

router.get('/blog', getAllBlogEntries);
router.get('/events', getEvents)
// TODO add events 

router.get('/update', initiateMainUpdate)