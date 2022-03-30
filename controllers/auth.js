const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
const res = require("express/lib/response");

const handleError = (err, next) => {
  if (!err.code) {
    err.code = 500;
  }
  next(err);
};

exports.postLogin = () => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 404;
    error.data = errors.array();
    throw error;
  }

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("Not authenticated!");
        error.code = 401;
        throw error;
      } else {
        return bcrypt.compare(password, user.password).then((isEqual) => {
          if (!isEqual) {
            const error = new Error("Not authenticated!");
            error.code = 401;
            throw error;
          }

          const token = jwt.sign(
            {
              email,
            },
            process.env.JWT_TOKEN,
            {
              expiresIn: "1h",
            }
          );

          res.status(200).json({
            message: "Login successful",
            token,
          });
        });
      }
    })
    .catch((err) => {
      handleError(err);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;
  // Check if user exists
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(422).json("User already exists");
      } else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email,
              password: hashedPassword,
            });

            return user.save();
          })
          .then((result) => {
            res.status(201).json({
              message: "User created",
            });
          });
      }
    })
    .catch((err) => {
      handleError(err);
    });
};
