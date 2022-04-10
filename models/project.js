const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  liveUrl: String, 
},{
  timestamps:true
});

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
