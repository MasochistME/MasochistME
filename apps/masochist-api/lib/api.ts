import './instrument';

import * as Sentry from '@sentry/node';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { MongoInstance } from 'helpers/db';
import { log } from 'helpers/log';
import { initializeDayJS } from 'initialize/initializeDayJS';
// import { routerLegacy } from 'router/legacy';
import { routerV1 } from 'router/v1';
import { updateCurator } from 'router/v1/update';

initializeDayJS();

dotenv.config();
const app = express();

Sentry.setupExpressErrorHandler(app);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(
  cors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: process.env.CORS ?? 'http://localhost:3000',
    allowedHeaders: ['*', 'sentry-trace', 'baggage', 'authorization'],
  }),
);
app.set('trust proxy', 1);

// this is for prod env where req.user does not exist
app.use((req: any, res: any, next) => {
  res.locals.user = req.user;
  next();
});

// app.use('/api', routerLegacy);
app.use('/api/v1', routerV1);

// Intentional error to debug Sentry
app.get('/debug-sentry', function mainHandler(_req, _res) {
  throw new Error('My first Sentry error!');
});

app.listen(process.env.PORT, async () => {
  log.INFO(`Server listening at port ${process.env.PORT}!`);
});

/**
 * Initializing the database
 */

export const mongoInstance = new MongoInstance();

/**
 * Curator update function!
 */
const update = async () => {
  const { db } = mongoInstance.getDb();
  const collection = db.collection<{
    lastUpdate: Date;
    id: 'status';
  }>('update');
  const status = await collection.findOne({ id: 'status' });
  const { lastUpdate = 0 } = status ?? {};

  if (
    Date.now() - new Date(lastUpdate).getTime() >
    Number(process.env.BIG_DELAY)
  ) {
    updateCurator();
  }
};

if (process.env?.ENV === 'prod') setInterval(update, 60000); // TODO Change update cadence from 60000 to 600000
