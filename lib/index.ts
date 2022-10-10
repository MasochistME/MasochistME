import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
// import passport from 'passport';
import cookieParser from 'cookie-parser';
// import session from 'express-session';

import { tokenValidation } from 'helpers/validate';
import { getDataFromDB } from 'helpers/db';
import { log } from 'helpers/log';

import { routerLegacy } from 'router/legacy';
import { routerV1 } from 'router/v1';
import { routerAuth } from 'router/legacy/auth';
import { initiateMainUpdate } from 'router/legacy/update';

// const SteamStrategy = require('passport-steam').Strategy;
const app = express();

// const rootPath =
//   process.env.ENV === 'dev'
//     ? 'http://localhost'
//     : 'http://89.47.165.141';

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// passport.use(
//   new SteamStrategy(
//     {
//       returnURL: `${rootPath}:3002/auth/steam/redirect`,
//       realm: `${rootPath}:3002/`,
//       apiKey: process.env.STEAM_KEY,
//     },
//     async (identifier, profile, done) => {
//       process.nextTick(() => {
//         const member = getDataFromDB('members', {
//           id: profile?._json?.steamid ?? -1,
//         });
//         const userData = {
//           name: profile?._json?.personaname ?? 'UNKNOWN ENTITY',
//           id: Number(profile?._json?.steamid ?? -1),
//           identifier,
//           permissions: member?.groups ?? [],
//         };
//         return done(null, userData);
//       });
//     },
//   ),
// );

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(
  cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin:
      process.env.ENV === 'dev'
        ? 'http://localhost:3000'
        : 'http://masochist.me',
  }),
);
app.use(cookieParser());
app.set('trust proxy', 1);
// app.use(
//   session({
//     secret: process.env.AUTH,
//     cookie: { name: 'steam-session', maxAge: 360000, secure: false },
//   }),
// );
// app.use(passport.initialize());
// app.use(passport.session());

// this is for prod env where req.user does not exist
app.use((req: any, res: any, next) => {
  res.locals.user = req.user;
  next();
});

// this is temp fix for token check
app.put('*', tokenValidation);
app.post('*', tokenValidation);
app.delete('*', tokenValidation);

app.use('/api', routerLegacy);
app.use('/api/v1', routerV1);
app.use('/auth', routerAuth);

app.listen(process.env.PORT, () => {
  log.INFO(`Server listening at port ${process.env.PORT}!`);
});

// ------------

const update = async () => {
  const lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' });

  if (Date.now() - lastUpdated[0].timestamp > Number(process.env.BIG_DELAY)) {
    initiateMainUpdate();
  }
};

setInterval(update, 60000); // TODO change to 600000
