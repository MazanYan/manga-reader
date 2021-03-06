const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

const bookmarkQueries = ["not_added", "read_later", "reading", "completed", "favourite"];

router.post('/', function(req, res, next) {
    res.status(404).send("Search bookmarks of user");
});

router.get('/', function(req, res, next) {
    res.status(404).send("Search bookmarks of user");
});

/* GET bookmarks of specific user by their type */
router.get('/user', function(req, res, next) {
    console.log(`User ${req.query.user} Type ${req.query.type}`);
    if (!bookmarkQueries.includes(req.query.type))
        res.status(404).send("Query parameter 'type' is incorrect");
    else {
        dbInterface.getUserBookmarks(req.query.user, req.query.type)
            .then(response => {
                console.log("Bookmarks for specific user");
                console.log(response);
                res.send(response);
            }).catch(err => res.status(400).send(err));
    }
});

/* GET bookmark status for manga and specific user */
router.get('/manga', function(req, res, next) {
    const [userId, mangaId] = [req.query.user, req.query.manga];
    console.log(`Manga ${mangaId} User ${userId}`);
    dbInterface.getUserMangaBookmarkStatus(userId, mangaId)
        .then(response => {
            console.log(`${response}`);
            if (!response.length)
                res.send(JSON.stringify({ status: "not_added" }));
            else
                res.send(JSON.stringify({ status: response[0].type }));
        });
});

/* POST update status of manga bookmark for specific user */
router.post('/update', function(req, res, next) {
    console.log(req.body);
    const userId = req.body.userId;
    const mangaId = req.body.mangaId;
    const newStatus = req.body.newStatus;
    const newChapter = req.body.chapter;
    const newPage = req.body.page;
    dbInterface.updateBookmark(userId, mangaId, newStatus, newChapter, newPage)
        .then(response => {
            res.send(response);
        });
});

module.exports = router;
