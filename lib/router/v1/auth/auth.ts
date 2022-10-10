export const CLIENT_HOME_PAGE_URL = `${
  process.env.ENV === 'dev' ? 'http://localhost:3000' : 'http://masochist.me'
}/home`;

export const CLIENT_ERROR_PAGE_URL = `${
  process.env.ENV === 'dev' ? 'http://localhost:3000' : 'http://masochist.me'
}/error`;

export const authRedirectMiddleware = (
  req: any,
  _res: any,
  next: any,
): void => {
  req.url = req.originalUrl;
  next();
};
export const authRedirect = (_req: any, res: any) => {
  res.redirect(CLIENT_HOME_PAGE_URL);
};

export const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send({ error: 'Not authenticated.' });
};
