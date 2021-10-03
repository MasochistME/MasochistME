import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { getDataFromDB } from 'helpers/db';
// import { log } from 'helpers/log';
import { router } from 'router';
import { legacy } from 'router/legacyRouter';
import { getUserPermissions } from 'router/admin';
import { initiateMainUpdate } from 'router/update';
import config from '../config.json';

const SteamStrategy = require('passport-steam').Strategy;
const app = express();

const rootPath =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost'
    : 'http://89.47.165.141';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: `${rootPath}:3002/auth/steam/redirect`,
      realm: `${rootPath}:3002/`,
      apiKey: config.STEAM_KEY,
    },
    (identifier, profile, done) => {
      const userData = {
        name: profile?._json?.personaname ?? 'UNKNOWN ENTITY',
        id: profile?._json?.steamid ?? -1,
        identifier,
      };
      return done(null, userData);
    },
  ),
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(
  cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'http://masochist.me',
  }),
);
app.use(
  cookieSession({
    name: 'steam-session',
    keys: [config.STEAM_KEY],
    maxAge: 30 * 60 * 1000, // session will expire after 30 minutes
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', router);
app.use('/rest', legacy);

app.listen(config.PORT, () =>
  console.log(`Server listening at port ${config.PORT}!`),
);

// ------------

const update = async () => {
  const lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' });

  if (Date.now() - lastUpdated[0].timestamp > config.BIG_DELAY) {
    initiateMainUpdate();
  }
};

setInterval(update, 60000); // TODO change to 600000

// --------------------
// ------ AUTH --------
// --------------------

const CLIENT_HOME_PAGE_URL = `${
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://masochist.me'
}/home`;
const CLIENT_ERROR_PAGE_URL = `${
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'http://masochist.me'
}/error`;

const routerAuth = express.Router();

app.use('/auth', routerAuth);

routerAuth.get('/steam', passport.authenticate('steam'));

routerAuth.get('/steam/success', (req: any, res: any): void => {
  // Successful authentication, redirect home.
  if (req.user) {
    const user = {
      success: true,
      message: 'User has successfully authenticated!',
      user: req.user,
      cookies: req.cookies,
    };
    res.json(user);
  } else {
    res.status(401).json({ error: 'User is not authenticated.' });
  }
});

routerAuth.get('/steam/error', (req: any, res: any): void => {
  res.status(401).json({
    success: false,
    message: 'User failed to authenticate!',
  });
});

routerAuth.get(
  '/steam/redirect',
  (req: any, _res: any, next): void => {
    req.url = req.originalUrl;
    next();
  },
  passport.authenticate('steam', {
    failureRedirect: CLIENT_ERROR_PAGE_URL,
  }),
  (_req: any, res: any) => {
    console.log(_req.user);
    res.redirect(CLIENT_HOME_PAGE_URL);
  },
);

routerAuth.get('/steam/logout', (req: any, res: any): void => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

routerAuth.get('/permissions/:steamid', getUserPermissions);
