const Project = require("../models/project");
const Skill = require("../models/skill");

const { validationResult } = require("express-validator");

exports.postAddProject = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 422;
    error.data = errors.array();
    throw error;
  }

  const { title, description, imageUrl, github, liveUrl } = req.body;

  const project = new Project({
    title,
    description,
    imageUrl,
    github,
    liveUrl,
  });

  project
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Project created.",
        project: result._doc,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.putEditProject = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 422;
    error.data = errors.array();
    throw error;
  }

  const { projectId, data } = req.body;
  const { title, description, imageUrl, github, liveUrl } = data;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        const error = new Error("Project not found");
        error.code = 404;
        throw error;
      }

      return project.updateOne({
        title,
        description,
        imageUrl,
        github,
        liveUrl,
      });
    })
    .then((result) => {
      res.status(200).json({
        message: "Project updated",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteProject = (req, res, next) => {
  const { projectId } = req.params;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        const error = new Error("Project not found");
        error.code = 404;
        throw error;
      }

      return project.deleteOne();
    })
    .then((result) => {
      res.status(200).json({
        message: "Project deleted",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postAddSkill = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 422;
    error.data = errors.array();
    throw error;
  }

  const { slug } = req.body;
  return Skill.findOne({ slug })
    .then((skill) => {
      if (skill) {
        const error = new Error("Skill already exists");
        error.code = 409;
        throw error;
      }

      const newSkill = new Skill({ slug });

      return newSkill.save();
    })
    .then((result) => {
      return res.status(201).json({
        message: "Skill added",
        skill: result._doc,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteSkill = (req, res, next) => {
  const { skillId } = req.params;
  return Skill.findById(skillId)
    .then((skill) => {
      if (!skill) {
        const error = new Error("Skill not found");
        error.code = 404;
        throw error;
      }

      return Skill.deleteOne({ _id: skillId });
    })
    .then((result) => {
      res.status(200).json({
        message: "Skill deleted",
      });
    })
    .catch((err) => {
      next(err);
    });
};
