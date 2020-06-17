express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

router.get('/', function(req, res, next) {
    res.send("Search query");
});
  
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
