export const CLIENT_HOME_PAGE_URL = `${
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://masochist.me'
}/home`;

export const CLIENT_ERROR_PAGE_URL = `${
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://masochist.me'
}/error`;

export const authSuccess = (req: any, res: any): void => {
  // Successful authentication, redirect home.
  console.log(req.session);
  if (req.session?.passport?.user) {
    const user = {
      success: true,
      message: 'User has successfully authenticated!',
      user: req.session.passport.user,
      cookies: req.cookies,
    };
    res.json(user);
  } else {
    res.status(401).json({ error: 'User is not authenticated.' });
  }
};

export const authError = (req: any, res: any): void => {
  res.status(401).json({
    success: false,
    message: 'User failed to authenticate!',
  });
};

export const authRedirectMiddleware = (req: any, _res: any, next): void => {
  req.url = req.originalUrl;
  next();
};
export const authRedirect = (_req: any, res: any) => {
  res.redirect(CLIENT_HOME_PAGE_URL);
};
