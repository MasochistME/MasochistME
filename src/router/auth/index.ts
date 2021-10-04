import express from 'express';
import passport from 'passport';
import { getUserPermissions } from './admin';
import {
  authSuccess,
  authError,
  authRedirectMiddleware,
  authRedirect,
  CLIENT_HOME_PAGE_URL,
  CLIENT_ERROR_PAGE_URL,
} from './auth';

export const routerAuth = express.Router();

routerAuth.get('/steam', passport.authenticate('steam'));
routerAuth.get('/steam/success', authSuccess);
routerAuth.get('/steam/error', authError);

routerAuth.get(
  '/steam/redirect',
  authRedirectMiddleware,
  passport.authenticate('steam', {
    failureRedirect: CLIENT_ERROR_PAGE_URL,
  }),
  authRedirect,
);

routerAuth.get('/steam/logout', (req: any, res: any): void => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

routerAuth.get('/permissions/:steamid', getUserPermissions);
