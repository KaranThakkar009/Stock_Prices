const jwt = require("jsonwebtoken");
const config = require("config");
const jwtPrivateKey = config.get("jwtPrivateKey");

// generate jwt after signup
const generateToken = (payload) => {
  return jwt.sign(payload, jwtPrivateKey);
};

function authToken(req, res, next) {
  const bearerHeader = req.header("Authorization");
  if (!bearerHeader)
    return res.status(401).send("Access Denied. No token provided.");
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  if (!token) return res.status(401).send("Access Denied. No token provided.");

  try {
    // instead of jwt.sign, using jwt.verify to verify if it is a valid token
    const decoded = jwt.verify(token, jwtPrivateKey);
    // returns the value of the jwt if the token is verified
    req.user = decoded;
    next();
  } catch (err) {
    next({
      statusCode: 400,
      customMessage: "Invalid token",
    });
  }
}
module.exports = { generateToken, authToken };
