const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');
const multer  = require('multer');
const nameGenerator = require('../helpers/generateImageName');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/images/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
    //const imagePath = req.file.path.replace('/^public\//', '');
    //res.redirect(imagePath);
    res.send("Here you can upload image to server");
});

router.post('/', upload.single('image'), function(req, res, next) {
    const imageName = req.body;
    const newName = nameGenerator.mangaPage(...imageName);
    console.log('Received POST request');
    const imagePath = req.file.path.replace('/^public\//', '');
    res.redirect(imagePath);
});

module.exports = router;
