import express from 'express';
import cors from 'cors';
import { getDataFromDB } from 'helpers/db';
import { router } from 'router';
import { legacy } from 'router/legacyRouter';
import { initiateMainUpdate } from 'router/update';
import config from '../config.json';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(cors());
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
