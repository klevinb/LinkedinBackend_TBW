const express = require("express");
const listEndpoints = require("express-list-endpoints");
const cors = require("cors");
const { join } = require("path");

const port = process.env.PORT;
const publicPath = join(__dirname, "../public");

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
