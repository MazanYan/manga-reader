const express = require('express');
const router = express.Router();
const dbInterface = require('../helpers/dbInterface');
//const mailingData = require('../helpers/mailingData');
const addresses = require('../config');
const sendMail = require('../helpers/sendMail').sendMail;
require('dotenv').config();

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
  //next();
});

router.post('/recover_passw/:token', function(req, res, next) {
  const token = req.params.token;
  const newPasswd = req.body.newPasswd;

  console.log(token, newPasswd);

  dbInterface.resetPassword(token, newPasswd)
    .then(response => {
      res.send("Passw reset");
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
      to: req.body.email,
      subject: 'Registration',
      text: `You have registered on website 'manga-reader'.
      To confirm your account follow the link http://${addresses.serverAddress}/users/confirm/${token}`
    };

    sendMail(mailOptions);
    res.send(resp);
  });
});

/*
  Recover password of user
*/
router.post('/recover', function(req, res, next) {
  const email = req.body.email;
  console.log(email);
  dbInterface.getUserByEmail(email)
    .then(res => {
      if (res.length) {
        return dbInterface.createPasswordResetToken(res[0].id);
      }
    }).then(res => {
      const token = res;
      const mailOptions = {
          to: email,
          subject: 'Password recover',
          text: `You have forgot your password on website 'manga-reader'.
          To reset your password follow the link http://${addresses.clientAddress}/auth/reset_passwd/${token}`
        };

        sendMail(mailOptions);
    });
  res.send(email);
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
});

/*
  Get notifications of specific user
  ?quantity=all - all notifications
  ?quantity=read - all read notifications
  ?quantity=unread - only unread notifications
  &from=[number] - select read notification starting from [number]
  &to=[number] - select read notification ending on [number]
  &count={true | false} - count all notifications with specific type of specific user
  &select={true | false} - select comments' body
*/
router.get('/notifications/:userId', function(req, res, next) {
  const userId = req.params.userId;
  const notificationsType = req.query.quantity;

  const start = req.query.from;
  const end = req.query.to;

  let getNotificationsPromise;
  let countNotificationsPromise;

  const response = {
    notificationsCount: null,
    notificationsList: null
  };

  console.log('GET user\'s notifications');
  console.log(req.query);

  if (req.query.count === 'true') {
    console.log("Count notifications");
    countNotificationsPromise = dbInterface.countUserNotifications(userId, notificationsType)
      .then(queryResult => {
        response.notificationsCount = queryResult[0].count;
      });
  }
  if (req.query.select === 'true')
    getNotificationsPromise = dbInterface.getUserNotifications(userId, notificationsType, start, end)
      .then(queryResult => {
        let notifications;
        if (notificationsType === 'all')
          notifications = {
            read: queryResult.filter(notif => notif.readen === true),
            unread: queryResult.filter(notif => notif.readen === false)
          };
        else 
          notifications = queryResult;

        response.notificationsList = notifications;
      })/*.catch(err => res.status(400).send(`Invalid query parameters. ${err}`))*/;
  
  Promise.all([getNotificationsPromise, countNotificationsPromise])
    .then(_ => {
      console.log("Final Response");
      console.log(response);
      res.send(response);
    });
});

module.exports = router;
