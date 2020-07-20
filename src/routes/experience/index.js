const express = require("express");
const ExperienceModel = require("./schema");

const router = express.Router();

router.get("/:username/experience", async (req, res, next) => {
  try {
    const getAllExp = await ExperienceModel.find({
      username: req.params.username,
    });
    if (getAllExp) res.status(200).send(getAllExp);
    else res.status(404).send("Not found");
  } catch (error) {
    next(error);
  }
});

router.get("/:username/experience/:id", async (req, res, next) => {
  try {
    const findUserExp = await ExperienceModel.findOne({
      username: req.params.username,
      _id: req.params.id,
    });
    if (findUserExp) res.status(200).send(findUserExp);
    else res.status(404).send("Not found");
  } catch (error) {
    next(error);
  }
});

router.post("/:username/experience", async (req, res, next) => {
  try {
    const addExperience = new ExperienceModel(req.body);
    const { _id } = await addExperience.save();
    if (addExperience) res.status(201).send(_id);
    else res.status(400).send("Bad request");
  } catch (error) {
    next(error);
  }
});

router.put("/:username/experience/:id", async (req, res, next) => {
  try {
    delete req.body.username;

    const updateExp = await ExperienceModel.findOneAndUpdate(
      {
        username: req.params.username,
        _id: req.params.id,
      },
      req.body
    );
    if (updateExp) res.status(200).send("Updated");
    else res.status(404).send("Bad request");
  } catch (error) {
    next(error);
  }
});

router.delete("/:username/experience/:id", async (req, res, next) => {
  try {
    const deletedExp = await ExperienceModel.findOneAndDelete({
      username: req.params.username,
      _id: req.params.id,
    });

    if (deletedExp) res.status(200).send("Deleted");
    else res.status(400).send("Bad request");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
