const express = require("express");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");
const { join } = require("path");
const mongoose = require("mongoose");
const postRoutes = require("./routes/post")
const profileRoutes = require("./routes/profiles")
const mongoose = require("mongoose")

const port = process.env.PORT || 3003;
const publicPath = join(__dirname, "../public");

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.static(publicPath));
server.use("/post", postRoutes)


mongoose
.connect("mongodb://localhost:27017/LinkedinBackend_TBW", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(
  server.listen(port, () => {
    console.log(`Server running on port : ${port}`);
  })
)
.catch((err) => console.log(err))
server.use("/profiles", profileRoutes)



mongoose.connect("mongodb://localhost:27017/LinkedinBackend_TBW",
{useNewUrlParser: true,
useUnifiedTopology: true})
.then(
server.listen(port, () => {
    console.log(port)
})
)
