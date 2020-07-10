const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

/* GET manga by author/name search */
router.get('/', function(req, res, next) {
    res.status(404).send("Search query");
});

/* GET all necessary data about page of manga */
router.get('/page', function(req, res, next) {
    const manga = req.query.manga;
    const chapter = req.query.chapter;
    const page = req.query.page;
    const userVoterId = req.query.user;
    console.log({manga, chapter, page});
    
    const answer = {
        generalPageData: null,
        prevChapter: null,
        nextChapter: null,
        comments: null
    };
    
    const generalDataPromise = dbInterface
        .getMangaPageData(manga, chapter, page)
        .then(function(response) {
            console.log('General data response');
            console.log(response);
            answer.generalPageData = response;
        }).catch(err => console.log(err));

    const prevNextChapterPromise = dbInterface
        .getPrevNextChapterNum(manga, chapter)
        .then(function(response) {
            console.log('Prev and next chapters');
            answer.prevChapter = response[0].ch_num_prev;
            answer.nextChapter = response[0].ch_num_next;
        });

    const commentsPromise = dbInterface
        .getPageComments(manga, chapter, page, userVoterId)
        .then(response => {
            // make replies correspond to comments they reply on
            const commentsOrdered = [];
            for (let comment of response) {
                if (comment.answer_on === null) {
                    commentsOrdered.push({ ...comment, replies: [] });
                }
                else {
                    const originalCommentIndex = commentsOrdered.findIndex( 
                        origComment => origComment.comment_id === comment.answer_on 
                    );
                    commentsOrdered[originalCommentIndex].replies.push(comment);
                }
            }
            answer.comments = commentsOrdered;
        });

    Promise.all([generalDataPromise, prevNextChapterPromise, commentsPromise])
        .then(() => {
            res.send(JSON.stringify({response: answer}));
        })
        .catch(err => console.log(err));
});

/* POST manga by author/name search */
router.post('/', function(req, res, next) {
    const searchRequest = req.body.toSearch;
    console.log(searchRequest);
    dbInterface.searchMangaByNameAuthor(searchRequest, 100)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            res.send(found);
        })            
        .catch(err => {console.log(err); res.send(err);});
});

/* GET popular, recent and random manga for Main Page */
router.get('/main_page&lim=:limit', function(req, res, next) {
    const limit = req.params.limit;

    const answer = {
        popular: [],
        recent: [],
        random: []
    };
    
    const popularManga = dbInterface
        .searchPopularManga(limit)
        .then((response) => answer.popular = response);
        
    const recentManga = dbInterface
        .searchRecentManga(limit)
        .then((response) => answer.recent = response);

    const randomManga = dbInterface
        .searchRandomManga(limit)
        .then((response) => answer.random = response);
    
    Promise.all([popularManga, recentManga, randomManga])
        .then(() => {
            console.log(answer);
            res.send(JSON.stringify({response: answer}));
        })
        .catch(err => console.log(err));
    
    
});

/* POST popular, recent and random manga for Main Page */
router.post('/main_page', function(req, res, next) {
    res.status(404).send("Search query for Main Page");
});


/* GET general data about manga */
router.get('/mangaId/:id', function(req, res, next) {
    const mangaId = req.params.id;
    console.log('General data request for manga with id ', mangaId);
    dbInterface.getMangaByIdImage(mangaId)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            res.send(found);
        })            
        .catch(err => console.log(err));
});

/* POST general data about manga */
router.post('/mangaId', function(req, res, next) {
    res.status(404).send("GET request to this route is used to get general data about manga");
});

/* GET table of contents of manga by id */
router.get('/mangaId/:id/toc', function(req, res, next) {
    const mangaId = req.params.id;
    console.log('Table of contents request for manga with id ', mangaId);
    dbInterface.getTableOfContents(mangaId)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            res.send(found);
        })
        .catch(err => console.log(err));
});

/* POST table of contents of manga by id */
router.post('/mangaId/toc', function(req, res, next) {
    res.status(404).send("GET request to this route is used to get table of contents of a manga");
});

module.exports = router;
