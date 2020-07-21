const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

router.post('/comment', function(req, res, next) {
    dbInterface.deleteComment(req.body.id)
        .then(response => res.send("Comment deleted"))
        .catch(err => `${err}. Comment not deleted`);
});

module.exports = router;
