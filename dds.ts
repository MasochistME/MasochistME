import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config.json';
import { router } from './routes/router';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.set({
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Allow-Methods': 'OPTIONS, GET',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': config.CORS
    });
    next()
})

app.use('/rest', router);

app.listen(config.PORT, () => console.log(`Server listening at port ${ config.PORT }!`));