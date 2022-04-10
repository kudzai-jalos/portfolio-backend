const { Router } = require("express");
const { body } = require("express-validator");
const router = new Router();
const rootController = require("../controllers/index");

// set up routes

router.get("/projects", rootController.getProjects);
router.get("/projects/:projectId", rootController.getProject);

router.get("/skills", rootController.getSkills);
router.post(
  "/contact-me",
  [
    body("name", "Please enter a valid name.").trim().notEmpty(),
    body("email", "Please enter a valid email.")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("message", "Your message should not be empty.").trim().notEmpty(),
  ],
  rootController.postSendMessage
);

module.exports = router;
