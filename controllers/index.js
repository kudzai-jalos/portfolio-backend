// controllers
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const Project = require("../models/project");
const Skill = require("../models/skill");

exports.getProjects = (req, res, next) => {
  Project.find()
    .then((projects) => {
      res.status(200).json({
        projects,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProject = (req, res, next) => {
  const { projectId } = req.params;

  Project.findById(projectId)
    .then((project) => {
      if (!project) {
        const error = new Error("Project not found");
        error.code = 404;
        throw error;
      }

      res.status(200).json({
        message: "Fetched project.",
        project,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSkills = (req, res, next) => {
  Skill.find()
    .then((skills) => {
      res.status(200).json({
        skills,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postSendMessage = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.code = 422;
    error.data = errors.array();
    throw error;
  }

  const { name, email, message } = req.body;
  transporter
    .sendMail({
      to: process.env.SMTP_USER,
      from: email,
      subject: "New Message from " + name,
      html: `
      <p>Origin: Portfolio</p>
      <p>Email: ${email}</p>
      <p>Name: ${name}</p>
      <h2>Message</h2>
      <hr>
      <p>${message}</p>
    `,
    })
    .then(() => {
      res.status(200).json({
        message: "Message sent.",
      });
    })
    .catch((err) => {
      next(err);
    });
};
