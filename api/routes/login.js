const express = require('express')
const crypto = require('crypto-js');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dbInterface = require('../helpers/dbInterface');
const router = express.Router();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

/*function checkUser(userId, password) {
  return dbInterface.checkPassword(userId, password);
}*/

function verifyToken(token) {
  jwt.verify(token, SECRET_KEY, (err, authorized) => {
    if(err)
      return;
    else {
      return authorized.user;
    }
  });
}

router.get('/', function(req, res, next) {
  res.status(404).send("No login data is provided");
});

router.post('/', function(req, res, next) {
  console.log(`Processing request ${req.body.user}, ${req.body.passw}`);
  const userIdPromise = dbInterface.getUserByEmailOrUsername(req.body.user);

  let userId;
  userIdPromise.then(response => {
    if (response.length) {
      userId = response[0].id;
      return Promise.resolve(dbInterface.checkPassword(userId, req.body.passw));
    }
    else {
      console.log('User not found!');
      res.status(404).send("User not found");
      return;
    }
  }).then(response => {
    console.log(response ? 'Password correct' : 'Password incorrect');
    const token = jwt.sign({ user: userId }, SECRET_KEY, { expiresIn: '1h' });
    res.send({token: token});

  });
});

module.exports = router;
