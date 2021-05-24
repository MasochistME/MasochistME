import express from 'express';
// import { v4 as uuid } from 'uuid';

import {
  authSteam,
  authSteamSuccess,
  authSteamError,
  authSteamRedirect,
  authSteamLogout,
} from './steam';
import { getUserPermissions } from './admin';

export const routerAuth = express.Router();

routerAuth.get('/steam', authSteam);
routerAuth.get('/steam/success', authSteamSuccess);
routerAuth.get('/steam/error', authSteamError);
routerAuth.get('/steam/redirect', authSteamRedirect);
routerAuth.get('/steam/logout', authSteamLogout);

routerAuth.get('/permissions/:steamid', getUserPermissions);
