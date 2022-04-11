const User = require("../models/user");
const transporter = require("../util/smtp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

exports.postLogin = (req, res, next) => {
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
        if (user.status !== "Active") {
          const error = new Error("Account pending. Awaiting verification.");
          error.code = 401;
          throw error;
        }
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
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });

            const user = new User({
              email,
              password: hashedPassword,
              confirmationCode: token,
            });
            // TODO replace domain with live domain
            const verificationURL =
              process.env.MAIN_CLIENT+"/auth/accounts/verify/" + token;
            const rejectionURL =
              "https://kudzai-jalos-api.herokuapp.com/auth/accounts/reject/" + token;
            const buttonStyles =
              "color: #000000;padding: .5rem 2rem;background-color: #ffffff;border:2px solid #000000;";
            transporter.sendMail({
              to: process.env.SMTP_USER,
              from: process.env.SMTP_USER,
              subject: "Portfolio account confirmation",
              html: `
                <h2>Hello Kudzai.</h2>
                <p>A new account needs to be verified.</p>
                <p>Email address: ${email}</p>
                <p>Click on the button below to verify the account:</p>
                <form action="${verificationURL}" method="get">
                  <button style="" type="submit">Verify</button>
                </form>
                <p>Click on the button below to reject the account:</p>
                <form action="${rejectionURL}" method="post">
                  <button style="" type="submit">Reject</button>
                </form>
                
              `,
            });
            return user.save();
          })
          .then((result) => {
            res.status(201).json({
              message: "User created. Awaiting verification.",
            });
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postConfirmAccount = (req, res, next) => {
  const { token } = req.body;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const { email } = decodedToken;

  User.findOne({ email })
    .then((user) => {
      if (!user || user.confirmationCode !== token) {
        const error = new Error("Unauthorized.");
        error.code = 401;
        throw error;
      }

      if (user.status !== "Pending") {
        const error = new Error("Unauthorized.");
        error.code = 401;
        throw error;
      }
      user.status = "Active";
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Account verified.",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteRejectAccount = (req,res,next) => {
  const { token } = req.params;

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const { email } = decodedToken;

  User.findOne({ email })
    .then((user) => {
      if (!user || user.confirmationCode !== token) {
        const error = new Error("Unauthorized.");
        error.code = 401;
        throw error;
      }

      if (user.status !== "Pending") {
        const error = new Error("Unauthorized.");
        error.code = 401;
        throw error;
      }

      return user.deleteOne();
    })
    .then((result) => {
      res.status(200).json({
        message: "Signup rejection successful.",
      });
    })
    .catch((err) => {
      next(err);
    });
};
