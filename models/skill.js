const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const skillSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("skill",skillSchema);

module.exports = Skill;
