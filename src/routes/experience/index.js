const express = require("express");
const ExperienceModel = require("./schema");
const multer = require("multer");
const { join } = require("path");
const fs = require("fs-extra");
const json2csv = require("json2csv");

const router = express.Router();
const upload = multer();

const imgPath = join(__dirname, "../../../public/img/experiences");

router.get("/:username/experiences/CSV", async (req, res, next) => {
  const fields = [
    "role",
    "company",
    "startDate",
    "endDate",
    "description",
    "area",
    "username",
    "image",
  ];
  const opts = { fields };
  try {
    const experiences = await ExperienceModel.find();
    const csv = json2csv.parse(experiences, opts);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=experiences.csv"
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

router.get("/:username/experiences", async (req, res, next) => {
  try {
    const getAllExp = await ExperienceModel.find({
      username: req.params.username,
    });

    if (getAllExp.length > 0) res.status(200).send(getAllExp);
    else res.status(200).send([]);
  } catch (error) {
    next(error);
  }
});

router.get("/:username/experiences/:id", async (req, res, next) => {
  try {
    const findUserExp = await ExperienceModel.findOne(
      {
        username: req.params.username,
        _id: req.params.id,
      },
      ""
    );
    if (findUserExp) res.status(200).send(findUserExp);
    else res.status(404).send("Not found");
  } catch (error) {
    next(error);
  }
});

router.post("/:username/experiences", async (req, res, next) => {
  try {
    const addExperience = new ExperienceModel(req.body);
    const { _id } = await addExperience.save();
    if (addExperience) res.status(201).send(_id);
    else res.status(400).send("Bad request");
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:username/experiences/:id/picture",
  upload.single("picture"),
  async (req, res, next) => {
    try {
      await fs.writeFile(
        join(imgPath, `${req.params.id}.png`),
        req.file.buffer
      );

      const savePicture = await ExperienceModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          image: `http://localhost:${process.env.PORT}/img/experiences/${req.params.id}.png`,
        }
      );
      if (savePicture) res.status(201).send("Uploaded");
      else res.status(400).send("Something went wrong");
    } catch (error) {
      console.log(error);
    }
  }
);

router.put("/:username/experiences/:id", async (req, res, next) => {
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

router.delete("/:username/experiences/:id", async (req, res, next) => {
  try {
    const deletedExp = await ExperienceModel.findOneAndDelete({
      username: req.params.username,
      _id: req.params.id,
    });

    if (deletedExp) {
      if (fs.existsSync(join(imgPath, `${req.params.id}.png`))) {
        await fs.unlink(join(imgPath, `${req.params.id}.png`));
      }
      res.status(200).send("Deleted");
    } else res.status(400).send("Bad request");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
