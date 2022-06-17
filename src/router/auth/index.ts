import express from 'express';
import passport from 'passport';
import { getUserPermissions } from './admin';
import {
  ensureAuth,
  authRedirectMiddleware,
  CLIENT_HOME_PAGE_URL,
  CLIENT_ERROR_PAGE_URL,
} from './auth';

export const routerAuth = express.Router();

routerAuth.get('/', ensureAuth, (req: any, res: any) => {
  console.log(req.user);
  return res.status(200).send({ user: req.user });
});

routerAuth.get(
  '/steam',
  passport.authenticate('steam', {
    failureRedirect: CLIENT_ERROR_PAGE_URL,
    successRedirect: CLIENT_HOME_PAGE_URL,
  }),
);

routerAuth.get(
  '/steam/redirect',
  authRedirectMiddleware,
  passport.authenticate('steam', {
    failureRedirect: CLIENT_ERROR_PAGE_URL,
    successRedirect: CLIENT_HOME_PAGE_URL,
  }),
);

routerAuth.get('/steam/logout', (req: any, res: any): void => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

routerAuth.get('/permissions/:steamid', getUserPermissions);
