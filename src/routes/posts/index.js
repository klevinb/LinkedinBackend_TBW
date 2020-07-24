const express = require("express");
const { PostsModel } = require("./schema");
const ProfileModel = require("../profiles/schema");
const router = express.Router();
const multer = require("multer");
const upload = multer({});
const { join } = require("path");
const { writeFile } = require("fs-extra");
const fs = require("fs-extra");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const imgFolderPath = join(__dirname, "../../../public/img/posts");

router.get("/", async (req, res, next) => {
  try {
    const posts = await PostsModel.find(req.query)
      .populate("user")
      .populate("likes");
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await PostsModel.findById(id);
    if (post) {
      res.send(post);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading post a problem occurred!");
  }
});

router.post("/add/:id/like/:username", async (req, res, next) => {
  try {
    const post = await PostsModel.findById(req.params.id);
    if (post) {
      if (post.likes) {
        const checkLike = post.likes.find(
          (like) => like == req.params.username
        );

        if (checkLike) {
          const removeUser = await PostsModel.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.params.username },
          });
          if (removeUser) res.sendStatus(200);
        } else {
          const addUser = await PostsModel.findOneAndUpdate(
            { _id: req.params.id },
            {
              $addToSet: { likes: req.params.username },
            }
          );
          if (addUser) res.sendStatus(200);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await ProfileModel.findOne({ username: req.body.username });
    const newPost = new PostsModel({ ...req.body, user: user._id });
    const { _id } = await newPost.save();
    //{ runValidators: true }

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const post = await PostsModel.findByIdAndUpdate(req.params.id, req.body);
    if (post) {
      res.send("Ok");
    } else {
      const error = new Error(`post with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (fs.existsSync(join(imgFolderPath, `${req.params.id}.png`))) {
      await fs.unlink(join(imgFolderPath, `${req.params.id}.png`));
    }
    const post = await PostsModel.findByIdAndDelete(req.params.id);
    if (post) res.status(200).send("Deleted");
    else res.status(404).send("Not found");
  } catch (error) {
    next(error);
  }
});

// for upload (multiple)
router.post("/:id/upload", upload.single("avatar"), async (req, res, next) => {
  try {
    if (req.file) {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: "posts",
        },
        async (err, result) => {
          if (!err) {
            if (!err) {
              let resp = await PostsModel.findByIdAndUpdate(req.params.id, {
                image: result.secure_url,
              });
              if (resp) res.status(200).send("Done");
              else res.sendStatus(400);
            }
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
    } else {
      const err = new Error();
      err.httpStatusCode = 400;
      err.message = "Image file missing!";
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
