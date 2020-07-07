/* Routes for uploading non-image content (manga etc) */

const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

router.get('/', function(req, res, next) {

});

router.post('/', function(req, res, next) {

});

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
        res.send(JSON.stringify({result: resp}));
    });
    
});

router.get('/chapter', function(req, res, next) {
    res.send('Here you can upload data about chapter');
});


/* {mangaKey, name, number, volume = null} */
router.post('/chapter', function(req, res, next) {
    const request = req.body;
    console.log(request);

    const response = dbInterface.addChapter({
        mangaName: request.mangaName,
        chapterName: request.chapterName,
        chapterNumber: request.chapterNumber,
        chapterVolume: request.chapterVolume,
        images: request.images
    });

    Promise.all([response]).then(resp => {
        console.log(resp);
        res.send(JSON.stringify({result: resp}));
    });
});

router.post('/comment', function(req, res, next) {
    console.log(req.body);
    res.send('Send your comment here');
});

module.exports = router;
