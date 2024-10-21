const { checkToken } = require("../middleware/auth");

const indexRoute = (req, res) => {
  return res.status(200).json({
    message: "Servier is running",
  });
};

const verifyToken = (req, res) => {
  const queryParams = req.query;
  console.log("token to verify: ", queryParams);
  const verified = checkToken(queryParams.token);

  return res.status(200).json({
    message: "Token verification status",
    verified: verified,
  });
};

module.exports = {
  indexRoute,
  verifyToken,
};
