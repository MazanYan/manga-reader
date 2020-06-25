const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');
const nodemailer = require('nodemailer');
//const mailingData = require('../helpers/mailingData');
const addresses = require('../config');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secureConnection: true,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWD
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(404).send("respond with a resource");
});

router.post('/', function(req, res, next) {
  res.status(404).send("respond with a resource");
});

router.get('/new', function(req, res, next) {
  res.status(404).send("Add new user here");
});

router.post('/new', function(req, res, next) {
  console.log(req.body);
  const response = dbInterface.createUser({
    name: req.body.user,
    email: req.body.email,
    passw: req.body.passw
  }).then(response => {
  const [resp, token] = response;
  console.log(token);

  const mailOptions = {
    from: mailingData.email,
    to: req.body.email,
    subject: 'Registration',
    text: `You have registered on website 'manga-reader'.
    To confirm your account follow the link http://${addresses.serverAddress}/users/confirm/${token}`
  };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.send(resp);
  });
});

router.get('/confirm/:token', function(req, res, next) {
  const token = req.params.token;
  const timeToLive = '30:00.0';
  console.log({token: token});
  const confirmPromise = dbInterface.confirmUserByToken(token, timeToLive);

  Promise.all([confirmPromise]).then(response => {
    console.log("Account confirmed");
    console.log(response);
    res.send("Your account is confirmed!");
  });
})

module.exports = router;
