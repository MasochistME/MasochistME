import express from 'express';
import cors from 'cors';
import { getDataFromDB } from 'helpers/db';
import { router } from 'router';
import { legacy } from 'router/legacyRouter';
import { initiateMainUpdate } from 'router/old/update';
import config from '../config.json';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

setInterval(update, 600000);
