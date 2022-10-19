require('dotenv').config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { tokenValidation } from 'helpers/validate';
import { getDataFromDB } from 'helpers/db';
import { log } from 'helpers/log';

import { router } from 'router';
import { initiateMainUpdate } from 'router/update';

import config from '../config.json';

const app = express();

// const rootPath =
//   process.env.NODE_ENV === 'development'
//     ? 'http://localhost'
//     : 'http://89.47.165.141';

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
app.use(cookieParser());
app.set('trust proxy', 1);

// this is for prod env where req.user does not exist
app.use((req: any, res: any, next) => {
  res.locals.user = req.user;
  next();
});

// this is temp fix for token check
app.put('*', tokenValidation);
app.post('*', tokenValidation);
app.delete('*', tokenValidation);

app.use('/api', router);

app.listen(config.PORT, () => {
  log.INFO(`Server listening at port ${config.PORT}!`);
});

// ------------

const update = async () => {
  const lastUpdated = await getDataFromDB('update', { id: 'lastUpdated' });

  if (Date.now() - lastUpdated[0].timestamp > config.BIG_DELAY) {
    initiateMainUpdate();
  }
};

setInterval(update, 60000); // TODO change to 600000
