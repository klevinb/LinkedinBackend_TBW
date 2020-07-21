const express = require("express");
const expRoutes = require("../experience");
const profileRoutes = require("../profiles");
const postRoutes = require("../post");

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/profile", expRoutes);
router.use("/post", postRoutes);

module.exports = router;
