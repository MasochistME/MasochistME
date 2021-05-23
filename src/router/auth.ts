import express from 'express';
import passport from 'passport';
import { v4 as uuid } from 'uuid';

export const routerAuth = express.Router();

routerAuth.get(
  '/steam',
  passport.authenticate('steam', { failureRedirect: '/steam/error' }),
);

routerAuth.get(
  '/steam/success',
  passport.authenticate('steam', { failureRedirect: '/steam/error' }),
  (req: any, res: any) => {
    // Successful authentication, redirect home.
    if (req.user) {
      const userId = req.user.id;
      const token = uuid();
      res.redirect(`http://localhost:3000?userId=${userId}&token=${token}`);
    } else {
      res.redirect('http://localhost:3000/error');
    }
  },
);

routerAuth.get(
  '/steam/logout',
  passport.authenticate('steam', { failureRedirect: '/steam/error' }),
);
