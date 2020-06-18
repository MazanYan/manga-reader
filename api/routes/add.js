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
    const request = req.body;
    console.log("Adding information about manga to DB");
    console.log(req.body);
    console.log(Date.parse(req.body.time+'-01-01'));
    dbInterface.addManga({
        mangaName: req.body.name, 
        author: req.body.author, 
        descr: req.body.descr,
        thumbnail: req.body.fileName,
        time: req.body.time+'-01-01'});
});

module.exports = router;
