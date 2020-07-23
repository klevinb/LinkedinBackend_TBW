const express = require("express");
const expRoutes = require("../experience");
const profileRoutes = require("../profiles");
const postRoutes = require("../posts");
const commentRoutes = require("../comments");

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/profile", expRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
