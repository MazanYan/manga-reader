 express = require('express');
const router = express.Router();

/* GET searh. */
router.get('/', function(req, res, next) {
    res.send("Andomer_LL");
    //res.render('index', { title: 'Express' });
});
  
router.post('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
