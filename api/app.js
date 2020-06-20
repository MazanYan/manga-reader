const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const searchRouter = require('./routes/search');
const addRouter = require('./routes/add');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
//app.options('*', cors());  // enable pre-flight
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/search', searchRouter);
app.use('/add', addRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const multer  = require('multer');
const storageThumb = multer.diskStorage({ 
  destination: './public/images/thumb',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const storagePages = multer.diskStorage({
  destination: './public/images/manga_pages',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

const uploadThumbnail = multer({ storage: storageThumb });
const uploadMangaPage = multer({ storage: storagePages });

app.get('/upload/thumb', function(req, res, next) {
  res.send("Manga thumbnail images uploading route");
});

app.post('/upload/thumb', uploadThumbnail.single('file'), function(req, res, next) {
  //res.render('upload', {title: "Image uploaded"});
  //res.render("Image uploaded");
  //console.log(req.file);
  //console.log(req.file.filename);
  //console.log(req.files);
  //const file = req.file;
  
});

app.post('/upload/manga_pages', uploadMangaPage.single('file'), function(req, res, next) {
  console.log("Some page file received");
});

module.exports = app
