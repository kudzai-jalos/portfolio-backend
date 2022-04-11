const { Router } = require("express");
const { body } = require("express-validator");

const authContoller = require("../controllers/auth");

const router = new Router();

const authValidation = [
  body("email", "Please enter a valid email.")
    .trim()
    .isEmail()
    .normalizeEmail(),
  // .custom((value, { req }) => {
  //   // TODO use OTP's
  //   return (
  //     /kudzai\.jalos@younglings\.africa/i.test(value) ||
  //     /kudzaijalos@gmail\.com/i.test(value)
  //   );
  // })
  body(
    "password",
    "Your password should be at least 8 characters long."
  ).isLength({ min: 8 }),
];

router.post("/login", authValidation, authContoller.postLogin);
router.post("/signup", authValidation, authContoller.postSignup);
router.post("/accounts/verify/", authContoller.postConfirmAccount);
router.post("/accounts/reject/:token", authContoller.deleteRejectAccount);

module.exports = router;
