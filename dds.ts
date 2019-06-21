import '@babel/polyfill';
import express from 'express';
import config from './config.json';
import { router } from './routes/router';

const app = express();

app.use('/rest', router);
app.listen(config.PORT, () => console.log(`Server listening at port ${ config.PORT }!`));