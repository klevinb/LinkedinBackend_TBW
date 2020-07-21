const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const ExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, "You should provide us info about your Role"],
      validate: {
        validator: (value) => {
          if (value.length < 3) {
            throw new Error("Role should be at least 3 char");
          }
        },
      },
    },
    company: {
      type: String,
      required: [true, "What was the name of the company"],
    },
    startDate: {
      type: Date,
      required: [true, "When did you start this experience"],
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      required: [true, "Description needed"],
    },
    area: {
      type: String,
      required: [true, "Add area for your experience"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ExperienceModel = mongoose.model("Experiences", ExperienceSchema);

module.exports = ExperienceModel;
