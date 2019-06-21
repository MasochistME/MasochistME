import express from 'express';
export const router = express.Router();

import { test } from './badges';

router.get('/test', test)