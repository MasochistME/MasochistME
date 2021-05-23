import express from 'express';
import passport from 'passport';
// import { v4 as uuid } from 'uuid';

export const routerAuth = express.Router();
const CLIENT_HOME_PAGE_URL = 'http://localhost:3000/home';
const CLIENT_ERROR_PAGE_URL = 'http://localhost:3000/error';

routerAuth.get('/steam', passport.authenticate('steam'));

routerAuth.get('/steam/success', (req: any, res: any) => {
  // Successful authentication, redirect home.
  if (req.user) {
    const userData = {
      success: true,
      message: 'User has successfully authenticated!',
      user: req.user,
      cookies: req.cookies,
    };
    res.json(userData);
  } else {
    res.status(401).json({ error: 'User is not authenticated.' });
  }
});

routerAuth.get('/steam/error', (req: any, res: any) => {
  res.status(401).json({
    success: false,
    message: 'User failed to authenticate!',
  });
});

routerAuth.get(
  '/steam/redirect',
  passport.authenticate('steam', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: CLIENT_ERROR_PAGE_URL,
  }),
);

routerAuth.get('/steam/logout', (req: any, res: any) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});
