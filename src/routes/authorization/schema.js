const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const validation = require("validator");

const UserSchema = new Schema({
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: async (value) => {
        if (!validation.isEmail(value)) {
          throw new Error("Email is invalid");
        } else {
          const checkEmail = await UserModel.findOne({ email: value });
          if (checkEmail) {
            throw new Error("Email already existsts");
          }
        }
      },
    },
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator: async (value) => {
        const checkUsername = await UserModel.findOne({ username: value });
        if (checkUsername) {
          throw new Error("Username already exists!");
        }
      },
    },
  },
  token: {
    type: String,
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
