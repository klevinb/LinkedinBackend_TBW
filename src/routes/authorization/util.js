const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, process.env.SECRET_KEY, function (err, decoded) {
        if (!err) {
          next();
        } else {
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyToken,
};
