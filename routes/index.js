const {Router} = require("express");

const router = new Router();
const rootController = require("../controllers/index")

// set up routes

router.get("/projects",rootController.getProjects);


module.exports = router;