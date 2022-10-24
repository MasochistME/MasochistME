import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import { getDataFromDB } from 'helpers/db';
import { log } from 'helpers/log';

import { routerLegacy } from 'router/legacy';
import { routerV1 } from 'router/v1';
import { initiateMainUpdate } from 'router/legacy/update';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(
  cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: process.env.CORS ?? 'http://localhost:3000',
  }),
);
app.set('trust proxy', 1);

// this is for prod env where req.user does not exist
app.use((req: any, res: any, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/api', routerLegacy);
app.use('/api/v1', routerV1);

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

if (process.env?.ENV === 'prod') setInterval(update, 60000); // TODO Change update cadence from 60000 to 600000
