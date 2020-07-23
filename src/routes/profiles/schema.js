const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const validation = require("validator");

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          if (!validation.isLength(value, { min: 2 })) {
            throw new Error("Name should be at least 2 characters long!");
          }
        },
      },
    },
    surname: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          if (!validation.isLength(value, { min: 2 })) {
            throw new Error("Name should be at least 2 characters long!");
          }
        },
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: async (value) => {
          if (!validation.isEmail(value)) {
            throw new Error("Email is invalid");
          } else {
            const checkEmail = await profileModel.findOne({ email: value });
            if (checkEmail) {
              throw new Error("Email already existsts");
            }
          }
        },
      },
    },
    bio: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    cover: {
      type: String,
    },
    about: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      validate: {
        validator: async (value) => {
          const checkUsername = await profileModel.findOne({ username: value });
          if (checkUsername) {
            throw new Error("Username already exists!");
          }
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

profileModel = mongoose.model("profile", profileSchema);
module.exports = profileModel;
