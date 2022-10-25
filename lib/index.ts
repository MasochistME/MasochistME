import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { connectToDb } from 'helpers/db';
import { log } from 'helpers/log';

// import { routerLegacy } from 'router/legacy';
import { routerV1 } from 'router/v1';
import { updateCurator } from 'router/v1/update';

dotenv.config();
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

// app.use('/api', routerLegacy);
app.use('/api/v1', routerV1);

app.listen(process.env.PORT, () => {
  log.INFO(`Server listening at port ${process.env.PORT}!`);
});

// ------------

const update = async () => {
  const { client, db } = await connectToDb();
  const collection = db.collection('update');
  //@ts-ignore
  const { lastUpdate = 0 } = await collection.findOne({ id: 'status' });
  client.close();
  if (
    Date.now() - new Date(lastUpdate).getTime() >
    Number(process.env.BIG_DELAY)
  ) {
    updateCurator();
  }
};

if (process.env?.ENV === 'dev') setInterval(update, 1000); // TODO Change update cadence from 60000 to 600000
