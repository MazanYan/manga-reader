/* Routes for uploading non-image content (manga etc) */

const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');
//const notif = require('../helpers/notifications');
const addresses = require('../config');

router.get('/manga', function(req, res, next) {
    res.send('Here you can upload data about manga');
});

//{name, author, descr, thumbnail, time = null}
router.post('/manga', function(req, res, next) {
    const response = dbInterface.addManga({
        mangaName: req.body.name, 
        author: req.body.author, 
        descr: req.body.descr,
        timeStart: req.body.yearStarted+'-01-01',
        thumbnail: req.body.fileName,
        status: req.body.status,
        timeEnd: req.body.yearEnd ? req.body.yearEnd+'-01-01' : null
    });
    
    Promise.all([response]).then(resp => {
        res.send(JSON.stringify({ result: resp }));
    });
    
});

router.get('/chapter', function(req, res, next) {
    res.send('Here you can upload data about chapter');
});


/* {mangaKey, name, number, volume = null} */
router.post('/chapter', function(req, res, next) {
    const request = req.body;
    console.log(request);

    dbInterface.addChapter({
        mangaName: request.mangaName,
        chapterName: request.chapterName,
        chapterNumber: request.chapterNumber,
        chapterVolume: request.chapterVolume,
        images: request.images
    }).then(resp => {
        console.log(resp);
        res.send(JSON.stringify({ result: resp }));
    });
});

router.post('/comment', function(req, res, next) {
    const [
        author, manga,
        chapter, page,
        text, replyOn
    ] = [
            req.body.author, req.body.mangaKey, 
            req.body.chapterNum, req.body.pageNum, 
            req.body.text, req.body.replyOn
        ];
    dbInterface.addComment(
            author, manga, 
            chapter, page, 
            text, replyOn
        ).then(response => {
            res.send(`Comment added ${response}`);
        });
    if (req.body.replyOn) {
        dbInterface.getAuthorOriginalComment(req.body.replyOn)
            .then(origCommentAuthor => {
                const commentLink = `http://${addresses.clientAddress}/manga/${manga}/chapter${chapter}/page${page}`;
                const commentText = `You have a reply from ${origCommentAuthor} on your comment: '${text}'`;
                dbInterface.createNotification(author, commentText, 'Manga Reader', commentLink);
                //notif.createNotification(author, commentText, 'Manga Reader', commentLink);
            });
    }
});

module.exports = router;
