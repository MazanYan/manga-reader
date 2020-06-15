 express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');

/* GET searh. */
router.get('/', function(req, res, next) {
    //res.send(req);
    //res.render("Andomer_LL");
    res.send("Search query");
    //res.render('index', { title: 'Express' });
});
  
router.post('/', function(req, res, next) {
    //res.send(req);
    //res.render("Andomer_LL");
    const searchRequest = req.body.toSearch;
    //console.log(typeof searchRequest);
    dbInterface.searchMangaByName(searchRequest, 1)
        .then(function(response) {
            console.log(response);
            res.send(JSON.stringify({message: response}));
        })            
        .catch(err => console.log(err));
    //res.render('index', { title: 'Express' });
});

module.exports = router;
