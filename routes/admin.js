const { Router } = require("express");
const { body } = require("express-validator");
const techstack = require("@shiroi-shi/techstack");

const router = new Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const projectValidation = [
  body("title", "The title may not be empty.").notEmpty(),
  body("description", "The description may not be empty.").notEmpty(),
  body("imageUrl", "The image URL has to be a valid URL.")
    .notEmpty()
    .bail()
    .isURL(),
  body("github", "The github link has to be a valid URL")
    .notEmpty()
    .bail()
    .isURL(),
];

const skillValidation = [
  body("slug", "Please enter a valid skill")
    .notEmpty()
    .bail()
    .custom((value, { req }) => {
      const tech = techstack.all.find((t) => t.slug === value);
      return !!tech;
    }),
];

// Authorization middleware
router.use(isAuth);

// /projects
router
  .route("/projects")
  .post(projectValidation, adminController.postAddProject);

router
  .route("/projects/:projectId")
  .put(projectValidation, adminController.putEditProject)
  .delete(adminController.deleteProject);
// /skills
// TODO

router.route("/skills").post(skillValidation, adminController.postAddSkill);
router.route("/skills/:skillId").delete(adminController.deleteSkill);

module.exports = router;
