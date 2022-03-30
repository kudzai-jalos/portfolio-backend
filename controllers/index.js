// controllers

const Project = require("../models/project");

const handleError = (err, next) => {
  if (!err.code) {
    err.code = 500;
  }
  next(err);
};

exports.getProjects = (req, res, next) => {
  Project.find()
    .then((projects) => {
      res.status(200).json({
        projects
      })
    })
    .catch((err) => {
      handleError(err, next);
    });
};


// exports.postProject = (req,res,next) => {
//   const 
// }