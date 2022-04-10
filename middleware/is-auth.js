const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.code = 401;
    throw error;
  }
  User.findOne({ email: decodedToken.email })
    .then((user) => {
      if (!user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }

      req.isAuth = true;
      return next();
    })
    .catch((err) => {
      next(err);
    });

};
