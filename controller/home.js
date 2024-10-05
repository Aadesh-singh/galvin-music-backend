const indexRoute = (req, res) => {
  return res.status(200).json({
    msg: "Servier is running",
  });
};

module.exports = {
  indexRoute,
};
