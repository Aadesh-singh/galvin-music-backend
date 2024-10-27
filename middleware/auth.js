require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied");
  console.log("token fetched: ", token);

  try {
    let tokenStr = token.split(" ")[1];
    const verified = jwt.verify(tokenStr, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Error in verifying token", err);
    res.status(400).send("Invalid token");
  }
};

const checkToken = (token) => {
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  return verified;
};

const getToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = {
  authenticateToken,
  getToken,
  checkToken,
};
