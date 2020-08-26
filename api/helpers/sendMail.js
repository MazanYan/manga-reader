const nodemailer = require('nodemailer');
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

function sendMail({to, subject, text}) {

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendMail
}
