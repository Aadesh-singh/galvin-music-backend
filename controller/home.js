const indexRoute = (req, res) => {
  return res.status(200).json({
    message: "Servier is running",
  });
};

module.exports = {
  indexRoute,
};
