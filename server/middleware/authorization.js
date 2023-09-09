const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");
    //console.log("Token from auth server: ",jwtToken);

    if (!jwtToken) {
      return res.status(403).json(false);
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    // setting payload.user as the user, because we set user as the payload in jwtGenerator.js
    // so when decrypting the token we can get back the user
    req.user = payload.user;

    // console.log("from Authorized: ",req.body);

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json(false);
  }
};
