const express = require("express");
const { CommentsModel } = require("./schema");
const router = express.Router();
const multer = require("multer");
const upload = multer({});
const { join } = require("path");
const { writeFile } = require("fs-extra");
const fs = require("fs-extra");

router.get("/", async (req, res, next) => {
  try {
    const comments = await CommentsModel.find(req.query).populate("user");
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = await CommentsModel.findById(id);
    if (comment) {
      res.send(comment);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading comment a problem occurred!");
  }
});
router.post("/", async (req, res, next) => {
  try {
    const newComment = new CommentsModel(req.body);
    const { _id } = await newComment.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const comment = await CommentsModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (comment) {
      res.send("Ok");
    } else {
      const error = new Error(`comment with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const comment = await CommentsModel.findByIdAndDelete(req.params.id);
    if (comment) res.status(200).send("Deleted");
    else res.status(404).send("Not found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
