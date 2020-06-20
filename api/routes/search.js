const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

/* GET manga by author/name search */
router.get('/', function(req, res, next) {
    //`http://localhost:3000/search/manga=?${manga}chapter=?${chapter}page=?${page}`
    res.send("Search query");
});

'`http://localhost:3000/search/?manga=${manga}&chapter=${chapter}&page=${page}'
router.get('/manga=:mg/chapter=:ch/page=:pg', function(req, res, next) {
    const manga = req.params.mg;
    const chapter = req.params.ch;
    const page = req.params.pg;
    console.log({manga, chapter, page});
    
    const answer = {
        generalPageData: null,
        prevChapter: null,
        nextChapter: null
        /*hasPrevChapter: null,
        hasNextChapter: null*/
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
            //console.log(response);
            answer.prevChapter = response[0].ch_num_prev;
            answer.nextChapter = response[0].ch_num_next;
        });

    /*const hasPrevChPromise = dbInterface
        .hasPrevChapter(manga, chapter)
        .then(function(response) {
            console.log('Has prev chapter');
            console.log(response);
            answer.hasPrevChapter = response;
        });
    
    const hasNextChPromise = dbInterface
        .hasNextChapter(manga, chapter)
        .then(function(response) {
            console.log('Has next chapter');
            console.log(response);
            answer.hasNextChapter = response;
        });*/

    Promise.all([generalDataPromise, prevNextChapterPromise])
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
            //console.log(found);
            res.send(found);
        })            
        .catch(err => {console.log(err); res.send(err);});
});

/* GET popular, recent and random manga for Main Page */
router.get('/main_page', function(req, res, next) {
    res.send("Search query for Main Page");
});

/* POST popular, recent and random manga for Main Page */
router.post('/main_page', function(req, res, next) {
    const searchRequest = req.body;
    //console.log(searchRequest);
    const answer = {
        popular: [],
        recent: [],
        random: []
    };
    
    const popularManga = dbInterface
        .searchPopularManga(searchRequest.limit)
        .then((response) => answer.popular = response);
        
    const recentManga = dbInterface
        .searchRecentManga(searchRequest.limit)
        .then((response) => answer.recent = response);

    const randomManga = dbInterface
        .searchRandomManga(searchRequest.limit)
        .then((response) => answer.random = response);
    
    Promise.all([popularManga, recentManga, randomManga])
        .then(() => res.send(JSON.stringify({response: answer})))
        .catch(err => console.log(err));
});


/* GET general data about manga */
router.get('/mangaId/:id', function(req, res, next) {
    const mangaId = req.params.id;
    console.log('General data request for manga with id ', mangaId);
    dbInterface.getMangaByIdImage(mangaId)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            //console.log(found);
            res.send(found);
        })            
        .catch(err => console.log(err));
});

/* POST general data about manga */
router.post('/mangaId', function(req, res, next) {
    res.send("GET request to this route is used to get general data about manga");
});

/* GET table of contents of manga by id */
router.get('/mangaId/:id/toc', function(req, res, next) {
    const mangaId = req.params.id;
    console.log('Table of contents request for manga with id ', mangaId);
    dbInterface.getTableOfContents(mangaId)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            //console.log(found);
            res.send(found);
        })
        .catch(err => console.log(err));
});

/* POST table of contents of manga by id */
router.post('/mangaId/toc', function(req, res, next) {
    res.send("GET request to this route is used to get table of contents of a manga");
});

router.get('/manga_page', function(req, res, next) {
    res.send("Search manga page by id of manga, chapter and page numbers");
    
});

router.post('/manga_page', function(req, res, next) {
    const searchRequest = req.body.request;
    console.log("Request in nodejs");
    console.log(searchRequest);
    res.send("Temporary answer");
    /*const answer = {
        generalPageData: null,
        hasPrevChapter: null,
        hasNextChapter: null
    };
    
    const generalDataPromise = dbInterface
        .getMangaPageData(searchRequest.manga, searchRequest.chapter, searchRequest.page)
        .then(function(response) {
            console.log(response);
            answer.generalPageData = response;
        }).catch(err => console.log(err));

    const hasPrevChPromise = dbInterface
        .hasPrevChapter(searchRequest.manga, searchRequest.chapter)
        .then(function(response) {
            console.log(response);
            answer.hasPrevChapter = response;
        });
    
    const hasNextChPromise = dbInterface
    .hasNextChapter(searchRequest.manga, searchRequest.chapter)
    .then(function(response) {
        console.log(response);
        answer.hasNextChapter = response;
    });

    Promise.all([generalDataPromise, hasPrevChPromise, hasNextChPromise])
        .then(() => res.send(JSON.stringify({response: answer})))
        .catch(err => console.log(err));*/
});

module.exports = router;
