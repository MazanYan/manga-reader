const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');
const nodemailer = require('nodemailer');
const mailingData = require('../helpers/mailingData');
const addresses = require('../config');

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  secureConnection: true,
  port: 465,
  auth: {
    user: mailingData.email,
    pass: mailingData.password.toString()
  }
});

//const { createUser } = require('../helpers/dbInterface');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("respond with a resource");
});

router.post('/', function(req, res, next) {
  res.send("respond with a resource");
});

router.get('/new', function(req, res, next) {
  res.send("Add new user here");
});

router.post('/new', function(req, res, next) {
  console.log(req.body);
  const response = dbInterface.createUser({
    name: req.body.user,
    email: req.body.email,
    passw: req.body.passw
  }).then(response => {
  const [resp, token] = response;
  console.log(mailingData.password);

  const mailOptions = {
    from: mailingData.email,
    to: req.body.email,
    subject: 'Registration',
    text: `You have registered on website 'manga-reader'.
    To confirm your account follow the link http://${addresses.serverAddress}/confirm/${token}`
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

module.exports = router;
