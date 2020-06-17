express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

/* GET manga by author/name search */
router.get('/', function(req, res, next) {
    res.send("Search query");
});

/* POST manga by author/name search */
router.post('/', function(req, res, next) {
    const searchRequest = req.body.toSearch;
    console.log(searchRequest);
    dbInterface.searchMangaByNameAuthor(searchRequest, 1)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            console.log(found);
            res.send(found);
        })            
        .catch(err => console.log(err));
});

/* GET popular, recent and random manga for Main Page */
router.get('/main_page', function(req, res, next) {
    res.send("Search query for Main Page");
});

/* POST popular, recent and random manga for Main Page */
router.post('/main_page', function(req, res, next) {
    const searchRequest = req.body;
    console.log(searchRequest);
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
router.get('/mangaId', function(req, res, next) {
    res.send("Search query manga by id");
});

/* POST general data about manga */
router.post('/mangaId', function(req, res, next) {
    const searchRequest = req.body.toSearch;
    console.log(searchRequest);
    dbInterface.getMangaByIdImage(searchRequest)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            console.log(found);
            res.send(found);
        })            
        .catch(err => console.log(err));
});

/* GET table of contents of manga by id */
router.get('/mangaId/toc', function(req, res, next) {
    res.send("Search table of contents of manga by id");
});

/* POST table of contents of manga by id */
router.post('/mangaId/toc', function(req, res, next) {
    const searchRequest = req.body.toSearch;
    console.log(searchRequest);
    dbInterface.getTableOfContents(searchRequest)
        .then(function(response) {
            const found = JSON.stringify({message: response});
            console.log(found);
            res.send(found);
        })
        .catch(err => console.log(err));
});

module.exports = router;
