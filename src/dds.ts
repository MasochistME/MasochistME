import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { getDataFromDB } from 'helpers/db';
// import { log } from 'helpers/log';
import { router } from 'router';
import { routerAuth } from 'router/auth';
import { legacy } from 'router/legacyRouter';
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
    async (identifier, profile, done) => {
      const member = getDataFromDB('members', {
        id: profile?._json?.steamid ?? -1,
      });
      const userData = {
        name: profile?._json?.personaname ?? 'UNKNOWN ENTITY',
        id: Number(profile?._json?.steamid ?? -1),
        identifier,
        permissions: member?.groups ?? [],
      };
      return done(null, userData);
    },
  ),
);

app.use(cookieParser());
app.use(
  session({
    secret: config.STEAM_KEY,
    cookie: { name: 'steam-session', maxAge: 360000 },
  }),
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
app.use(passport.initialize());
app.use(passport.session());

// this is for prod env where req.user does not exist
app.use((req: any, res: any, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/api', router);
app.use('/auth', routerAuth);
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
