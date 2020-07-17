const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

router.post('/', function(req, res, next) {
    res.status(403).send('Update something here');
});

router.post('/vote', function(req, res, next) {
    const voteComment = {
        voterId: req.body.voterId,
        commentId: req.body.commentId,
        vote: req.body.vote
    };
    dbInterface.voteComment(voteComment)
        .then( response => res.send(`Vote updated ${response}`) )
        .catch( err => res.send(`Comment not voted ${err}`) );
});

router.post('/comment', function(req, res, next) {
    const [commId, newText] = [req.body.id, req.body.text];
    dbInterface.updateComment(commId, newText)
        .then(response => res.send("Comment updated"));
});

router.post('/notification/:id', function(req, res, next) {
    const notificationId = req.params.id;
    dbInterface.readNotification(notificationId)
        .then(response => res.send(`Notification ${notificationId} is marked as read`))
        .catch(error => res.status(500).send('Unable to update comment'));
});

module.exports = router;
