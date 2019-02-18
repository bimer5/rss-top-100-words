import express from 'express';
import {getMostPopularWords} from './../services/rss/rssService';
const router = express.Router();

router.get('/', function (req, res, next) {
    getMostPopularWords(req.query.url)
        .then(result => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

module.exports = router;