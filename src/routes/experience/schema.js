const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
    },
    company: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    area: {
      type: String,
    },
    username: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const ExperienceModel = mongoose.model("Experiences", ExperienceSchema);

module.exports = ExperienceModel;
