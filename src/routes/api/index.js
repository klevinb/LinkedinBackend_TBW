const express = require("express");
const expRoutes = require("../experience");
const postRoutes = require("../post");
const router = express.Router();

router.use("/profiles", expRoutes);

module.exports = router;
