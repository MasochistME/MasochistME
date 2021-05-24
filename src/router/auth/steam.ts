import passport from 'passport';

const CLIENT_HOME_PAGE_URL = 'http://localhost:3000/home';
const CLIENT_ERROR_PAGE_URL = 'http://localhost:3000/error';

export const authSteam = passport.authenticate('steam');

export const authSteamSuccess = (req: any, res: any): void => {
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
};

export const authSteamError = (req: any, res: any): void => {
  res.status(401).json({
    success: false,
    message: 'User failed to authenticate!',
  });
};

export const authSteamRedirect = passport.authenticate('steam', {
  successRedirect: CLIENT_HOME_PAGE_URL,
  failureRedirect: CLIENT_ERROR_PAGE_URL,
});

export const authSteamLogout = (req: any, res: any): void => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
};
