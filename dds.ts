import '@babel/polyfill';
import express from 'express';
import config from './config.json';

const app = express();

app.get('/', (req, res) => { res.status(200).send(':3')})

app.listen(config.PORT, () => console.log(`Server listening at port ${ config.PORT }!`))