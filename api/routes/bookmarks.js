const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

const bookmarkQueries = ["read_later", "reading", "completed", "favourite"];

router.post('/', function(req, res, next) {
    res.status(404).send("Search bookmarks of user");
});

router.get('/:id/:type', function(req, res, next) {
    console.log(req.params.id, req.params.type);
    if (!bookmarkQueries.includes(req.params.type))
        res.status(404).send("Query parameter 'type' is incorrect");
    else {
        dbInterface.getUserBookmarks(req.params.id, req.params.type)
            .then(response => {
                res.send(JSON.stringify(response));
            }).catch(err => res.status(400).send(err));
    }
});

module.exports = router;