const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(404).send("Incorrect token");
      }
      console.log(decoded);
      //req.user = decoded.user;
      //next();
    });
}

module.exports = {
    verifyToken
}
