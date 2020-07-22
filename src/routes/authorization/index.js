const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("./schema");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const userTrue = await UserModel.findOne({
      $or: [
        { username: req.body.username, password: req.body.password },
        { email: req.body.username, password: req.body.password },
      ],
    });
    if (userTrue)
      res
        .status(201)
        .json({ token: userTrue.token, username: userTrue.username });
    else res.status(404).send("Incorrent email or password");
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const userBody = new UserModel(req.body);
    const addUser = await userBody.save();

    jwt.sign({ addUser }, process.env.SECRET_KEY, async (err, token) => {
      if (!err) {
        await UserModel.findByIdAndUpdate({ _id: addUser._id }, { token });
        res.status(201).json({ token, addUser });
      } else {
        res.status(400).send("Something went wrong!");
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
