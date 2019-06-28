import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config.json';
import { router } from './routes/router';

const app = express();

app.use(cors());
app.options('*', cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/rest', router);

app.listen(config.PORT, () => console.log(`Server listening at port ${ config.PORT }!`));