const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

exports.postLogin = (req,res,next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 422;
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
            process.env.JWT_SECRET,
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
      next(err);
    });
};

exports.postSignup = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 422;
    error.data = errors.array();
    throw error;
  }

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
      next(err);
    });
};
