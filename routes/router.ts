import express from 'express';
export const router = express.Router();

import { getAllBadges, getBadge, addBadge, updateBadge, deleteBadge } from './badges';
import { getAllPatrons, getPatronsByTier, getPatron, addPatron, updatePatron, deletePatron } from './patrons';

router.get('/badges', getAllBadges);
router.post('/badges', addBadge);
router.get('/badges/:id', getBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);

router.get('/patrons', getAllPatrons);
router.get('/patrons/tier/:tier', getPatronsByTier);
router.post('/patrons/tier/:tier/vanityid/:vanityid', addPatron);
router.get('/patrons/patron/:steamid', getPatron);
router.put('/patrons/patron/:steamid', updatePatron);
router.delete('/patrons/patron/:steamid', deletePatron);