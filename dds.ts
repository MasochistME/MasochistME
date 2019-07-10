import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config.json';
import { getDataFromDB } from './helpers/db';
import { router } from './routes/router';
import { initiateMainUpdate } from './routes/update';

const app = express();

app.use(cors());
app.options('*', cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/rest', router);

app.listen(config.PORT, () => console.log(`Server listening at port ${ config.PORT }!`));

// ------------

const update = async () => {
    const lastUpdated = await getDataFromDB('special', { id: 'lastUpdated' });

    if (Date.now() - lastUpdated[0].timestamp > config.BIG_DELAY)
        initiateMainUpdate();
    };

setInterval(update, 600000)