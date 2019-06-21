import express from 'express';
export const router = express.Router();

import { getAllBadges, getBadge, addBadge, updateBadge, deleteBadge } from './badges';

router.get('/badges', getAllBadges);
router.post('/badges', addBadge);
router.get('/badges/:id', getBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);