const express = require('express');
const router = express.Router();
//const dbInterface = require('../helpers/dbInterface');
//const multer  = require('multer');
//const nameGenerator = require('../../client/src/helpers/generateImageName');

/*const storage = multer.diskStorage({
    destination: './images/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });
*/
/*router.get('/', function(req, res, next) {
    //const imagePath = req.file.path.replace('/^public\//', '');
    //res.redirect(imagePath);
    res.send("Here you can upload image to server");
});*/

/*router.post('/', upload.single('image'), function(req, res, next) {
    const image = req.file;
    //console.log(image.originalname);
    //const newName = nameGenerator.mangaPage(...image);
    console.log('Received POST request');
    const imagePath = req.file.path.replace('/^public\//', '');
    res.redirect(imagePath);
});*/

//router.post('/', (req, res, next) => {
    //console.log(req);
    //console.log(req.file);
    //console.log(req.files.file);
    //let imageFile = req.files.file;
  
    //imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, function(err) {
    //  if (err) {
    //    return res.status(500).send(err);
    //  }
  
    //  res.json({file: `public/${req.body.filename}.jpg`});
    //});
  
  //})

router.get('/', (req, res) => {
    res.send("Path to upload images");
});

// file upload api
/*router.post('/', (req, res) => {
    if (!req.thumbnail) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;    //  mv() method places the file inside public directory
    console.log(myFile.name);
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
});*/

module.exports = router;
