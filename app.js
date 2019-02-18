import express from 'express';
import logger from 'morgan';
import rssRouter from './routes/rss';

const PORT = '3000';
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/rss', rssRouter);

app.listen(PORT, function() {
    console.log('Listening on ' + PORT);});

module.exports = app;
