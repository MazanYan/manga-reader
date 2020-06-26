const jwt = require('jsonwebtoken');
const dbInterface = require('./dbInterface');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

function verifyToken(token) {
  const verifiedUser = jwt.verify(token, SECRET_KEY, async (err, authorized) => {
    if(err) {
      console.log("Verification error");
      return;
    }
    else {
      console.log("Verification completed");
      const userId = authorized.user;
      const userName = (await dbInterface.getUserName(userId))[0].name;
      console.log(userName);
      return { id: authorized.user, name: userName };
    }
  });
  return verifiedUser;
}

module.exports = {
    verifyToken
}
