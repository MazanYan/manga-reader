const express = require('express')
const cryptoJS = require('crypto-js');

const passport = require('passport')
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const salt = "1234";
const DATA = [{email: cryptoJS.SHA256("test@gmail.com"), password: cryptoJS.SHA256("1234")}]
DATA.map(el => cryptoJS.SHA256(el + salt));

var opts = {}
opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};
opts.secretOrKey = 'secret';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log("JWT BASED VALIDATION GETTING CALLED")
  console.log("JWT", jwt_payload)
  if (CheckUser(jwt_payload.data)) {
      return done(null, jwt_payload.data)
  } else {
      // user account doesnt exists in the DATA
      return done(null, false);
  }
}));

function CheckUser(input){
  console.log(DATA)
  console.log(input)

  for (var i in DATA) {
      //if(/*input.email==DATA[i].email && (input.password==DATA[i].password || DATA[i].provider==input.provider)*/)
      if (cryptoJS.SHA256(input[i].email + salt) == DATA[i].email || cryptoJS.SHA256(input[i].password + salt)==DATA[i].password)
      {
          console.log('User found in DATA');
          return true;
      }
      else
        continue;
          //console.log('no match')
    }
  console.log('User not found in DATA');
  return false;
}

/*passport.serializeUser(function(user, cb) {
  console.log('I should have jack ');
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  console.log('I wont have jack shit');
  cb(null, obj);
});*/

const router = express.Router();

router.get('/', function(req, res, next) {
  res.send("The connection between server and client is established");
  //res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log(`Processing request ${req.body}`);
  if(CheckUser(req.body)) {
      console.log('Processing successful');
      let token = jwt.sign({data: req.body}, 'secret', { expiresIn: '1h' });
      res.cookie('jwt', token);
      res.send(`Log in success ${req.body.email}`);
  }
  else {
    console.log('Processing unsuccessful');
    res.send('Invalid login credentials');
  }
    //res.render('index', { title: 'Express' });
  });

module.exports = router;
