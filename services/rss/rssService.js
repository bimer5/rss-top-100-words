import Parser from 'rss-parser';
import sanitizeHtml from 'sanitize-html';
import PQueue from "p-queue";

const queue = new PQueue({concurrency: 3});
const parser = new Parser();

const getPopularWords = (sentences) => {
    let popularWords = {};
    sentences.forEach((sentence) => {
        const words = sentence.split(" ");
        words.forEach((word) => {
            popularWords[word] = popularWords[word] ? popularWords[word] + 1 : 1;
        })
    });
    return popularWords;
};

const createPopularWordList = (popularWords) => {
    let popularWordsList = [];
    Object.keys(popularWords)
        .forEach((key) => {
            const obj = {
                word: key,
                count: popularWords[key]
            };
            popularWordsList.push(obj)
        });
    return popularWordsList;
};

const getItemTexts = (items) => {
    return items.map((item) => {
        return sanitizeHtml(item.title)  + " " + sanitizeHtml(item.contentSnippet);
    });
};

const sortList = (popularWordsList) => {
    return popularWordsList.sort((obj1, obj2) => {
        return obj2.count - obj1.count
    });
};

const fetchTop100WordsFromFeed = async (feedUrl) => {
    const feed = await parser.parseURL(feedUrl);

    const itemTexts = getItemTexts(feed.items);

    const popularWords = getPopularWords(itemTexts);
    const popularWordsList = createPopularWordList(popularWords);

    return sortList(popularWordsList).slice(0, 100);
};

const getMostPopularWords = async (feedUrl) => {
    return await queue.add(() => fetchTop100WordsFromFeed(feedUrl));
};

module.exports = {
    getMostPopularWords
};