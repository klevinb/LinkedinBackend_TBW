const express = require("express");
const q2m = require("query-to-mongo");
const profileSchema = require("./schema");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const pdfdocument = require("pdfkit");
const { join } = require("path");
const ExperienceModel = require("../experience/schema");
const UserModel = require("../authorization/schema");

const upload = multer();
const imagePath = path.join(__dirname, "../../../public/img/profiles");
const expPath = path.join(__dirname, "../../../public/img/experiences");

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const profiles = await profileSchema
      .find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    if (profiles.length > 0)
      res.send({
        data: profiles,
        total: profiles.length,
      });
    else res.status(404).send([]);
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const bearerHeaders = req.headers["authorization"];
    const bearer = bearerHeaders.split(" ");
    const token = bearer[1];

    const user = await UserModel.findOne({ token });
    const profile = await profileSchema.findOne({
      username: user.username,
    });
    if (profile) {
      res.send(profile);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const profile = await profileSchema.findOne({
      username: req.params.username,
    });
    if (profile) {
      res.send(profile);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newProfile = new profileSchema(req.body);
    const response = await newProfile.save();
    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedprofile = await profileSchema.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (updatedprofile) {
      res.send(updatedprofile);
    } else {
      const error = new Error(`profile with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:username/upload",
  upload.single("profile"),
  async (req, res, next) => {
    try {
      if (req.file) {
        await fs.writeFile(
          path.join(imagePath, `${req.params.username}.png`),
          req.file.buffer
        );

        const profile = await profileSchema.findOneAndUpdate(
          { username: req.params.username },
          {
            image: `${process.env.LINK}/img/profiles/${req.params.username}.png`,
          }
        );
        res.status(200).send("Done");
      } else {
        const err = new Error();
        err.httpStatusCode = 400;
        err.message = "Image file missing!";
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/:username/upload/cover",
  upload.single("cover"),
  async (req, res, next) => {
    try {
      if (req.file) {
        await fs.writeFile(
          path.join(imagePath, `${req.params.username}Cover.png`),
          req.file.buffer
        );

        const profile = await profileSchema.findOneAndUpdate(
          { username: req.params.username },
          {
            cover: `${process.env.LINK}/img/profiles/${req.params.username}Cover.png`,
          }
        );
        res.status(200).send("Done");
      } else {
        const err = new Error();
        err.httpStatusCode = 400;
        err.message = "Image file missing!";
        next(err);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get("/:username/pdf", async (req, res, next) => {
  try {
    const profile = await profileSchema.findOne({
      username: req.params.username,
    });
    const getExp = await ExperienceModel.find({ username: profile.username });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${profile.name}.pdf`
    );

    const doc = new pdfdocument();
    let photo = "";
    if (fs.existsSync(join(imagePath, `${req.params.username}.png`))) {
      photo = join(imagePath, `${req.params.username}.png`);
      doc.image(photo, 88, 30, {
        fit: [100, 100],
      });
    }
    doc.font("Times-Roman");
    doc.fontSize(18);

    doc.text(`${profile.name} ${profile.surname}`, {
      width: 410,
      align: "center",
    });
    doc.text(" ");
    doc.text("Experiences", {
      width: 410,
      align: "center",
    });
    doc.fontSize(12);
    getExp.forEach(
      (exp) =>
        doc.text(`
        Role: ${exp.role}
        Company: ${exp.company}
        Starting Date: ${exp.startDate.toString().slice(4, 15)}
        Ending Date: ${exp.endDate.toString().slice(4, 15)}
        Description: ${exp.description}
        Area:  ${exp.area}
        -------------------------------------------------------
      `),
      {
        width: 410,
        align: "center",
      }
    );
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }
});

router.delete("/:username", async (req, res, next) => {
  try {
    const profile = await profileSchema.findOneAndDelete({
      username: req.params.username,
    });
    if (profile) {
      const findExp = await ExperienceModel.find({
        username: profile.username,
      });

      const findUser = await UserModel.findOneAndDelete({
        username: profile.username,
      });

      await findExp.forEach(async (exp) => {
        fs.unlink(join(expPath, `${exp._id}.png`));
        await ExperienceModel.findByIdAndDelete(exp._id);
      });

      if (fs.existsSync(join(imagePath, `${profile._id}.png`))) {
        fs.unlink(join(imagePath, `${profile._id}.png`));
      }
      if (fs.existsSync(join(imagePath, `${req.params.username}Cover.png`))) {
        fs.unlink(join(imagePath, `${req.params.username}Cover.png`));
      }

      res.send("Deleted");
    } else {
      const error = new Error(`profile with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
