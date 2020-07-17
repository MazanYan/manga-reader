const express = require('express')
const crypto = require('crypto-js');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dbInterface = require('../helpers/dbInterface');
const notif = require('../helpers/notifications');
const verifyToken = require('../helpers/verifyToken').verifyToken;
const router = express.Router();
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

router.get('/', function(req, res, next) {
  res.status(404).send("No login data is provided");
});

router.post('/', function(req, res, next) {
  console.log(`Processing request ${req.body.user}, ${req.body.passw}`);
  const userIdPromise = dbInterface.getUserByEmailOrUsername(req.body.user);

  let userId;
  let userName;
  userIdPromise.then(response => {
    if (response.length) {
      userId = response[0].id;
      userName = response[0].name;
      return Promise.resolve(dbInterface.checkPassword(userId, req.body.passw));
    }
    else {
      console.log('User not found!');
      res.status(404).send("User not found");
      return;
    }
  }).then(response => {
    console.log(response ? 'Password correct' : 'Password incorrect');
    if (response) {
      const token = jwt.sign({ user: userId }, SECRET_KEY, { expiresIn: '1h' });
      res.send({ token: token, name: userName });
      return { userId: userId, author: 'Manga Reader', text: 'You are logged in on website \'Manga Reader\'' };
    }
    else
      res.status(400).send({ message: "Unable to log in. Password is incorrect" });
      throw Error('Unable to log in');
  }).then(notificationData => {
    notif.createNotification(notificationData.userId, notificationData.text, notificationData.author);
  }).catch(err => console.log(err));

});

router.post('/verify', async function(req, res, next) {
  const token = req.body.token;
  const user = await verifyToken(token);
  console.log("User after verification");
  console.log(user);
  if (user) {
    res.send(user);
  }
  else {
    res.status(401).send("Your token expired");
  }
});

module.exports = router;
