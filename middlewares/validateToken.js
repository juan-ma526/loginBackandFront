const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");

const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).send({ message: "No Token, authorization denied" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: "Invalid Token" });

    req.user = user;
  });

  next();
};

module.exports = { authRequired };
