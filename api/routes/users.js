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

/* GET data about user by ID */
router.get('/:id', function(req, res, next) {
  dbInterface.getUserPageData(req.params.id)
    .then(response => {
      const sendData = {
        username: response[0].name,
        online: response[0].is_online,
        photo: response[0].photo ? response[0].photo : 'sample.jpg',
        description: response[0].description
      };
      res.send(JSON.stringify(sendData));
    })
    .catch(err => res.status(404).send("User not found"));
});

router.post('/:id/edit_general', async function(req, res, next) {
  const newData = {
    name: req.body.username,
    photo: req.body.photo,
    description: req.body.descr
  };
  const userId = req.params.id;

  console.log(newData, userId);

  const password = req.body.passwd;
  const passwdCorrect = await dbInterface.checkPassword(userId, password);
  if (!passwdCorrect)
    res.status(401).send("Password incorrect");
  
  dbInterface.changeUserGeneralData(userId, newData)
    .then(response => {
      res.send(response);
    });
});

router.post('/:id/edit_passwd', async function(req, res, next) {
  const oldPassword = req.body.oldPasswd;
  const newPassword = req.body.newPasswd;
  const userId = req.params.id;
  const passwdCorrect = await dbInterface.checkPassword(userId, oldPassword);
  if (!passwdCorrect)
    res.status(401).send("Old password incorrect");

  dbInterface.changePassword(userId, newPassword)
    .then(response => {
      res.send(response);
    });
});

router.post('/', function(req, res, next) {
  res.status(404).send("No user data to get is specified");
});

router.get('/new', function(req, res, next) {
  res.status(404).send("Add new user here");
});

router.post('/new', function(req, res, next) {
  console.log(req.body);
  dbInterface.createUser({
    name: req.body.user,
    email: req.body.email,
    passw: req.body.passw
  }).then(response => {
    const [resp, token] = response;
    console.log(token);

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,//req.body.email,
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
