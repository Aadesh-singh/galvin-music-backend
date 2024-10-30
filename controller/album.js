const createAlbum = async (req, res) => {
  try {
    return res.status(200).json({ message: "Method not implemented yet" });
  } catch (error) {
    console.log("Error in creating Album: ", error);
    return res
      .status(500)
      .json({ code: "SERVER_ERROR", message: "Error in creating Album" });
  }
};

module.exports = {
  createAlbum,
};
