import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { getDataFromDB } from 'helpers/db';
// import { log } from 'helpers/log';
import { router } from 'router';
import { legacy } from 'router/legacyRouter';
import { routerAuth } from 'router/auth';
import { initiateMainUpdate } from 'router/update';
import config from '../config.json';

const SteamStrategy = require('passport-steam').Strategy;

const app = express();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new SteamStrategy(
    {
      returnURL: 'http://localhost:3002/auth/steam/redirect',
      realm: 'http://localhost:3002/',
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
    origin: 'http://localhost:3000',
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
