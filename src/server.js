const express = require("express");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");
const { join } = require("path");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

const port = process.env.PORT || 3003;
const publicPath = join(__dirname, "../public");

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.static(publicPath));

server.use("/api", apiRoutes);

console.log(listEndpoints(server));

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
  .catch((err) => console.log(err));
