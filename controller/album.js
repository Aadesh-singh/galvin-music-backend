const Album = require("../model/Album");

const albumTitleExist = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(401)
        .json({ code: "BAD_PAYLOAD", message: "Please send a valid payload" });
    }
    const albums = await Album.find({
      name: { $regex: `^${title}$`, $options: "i" },
    });
    if (albums.length > 0) {
      return res
        .status(200)
        .json({ available: false, message: "Album name already exist" });
    } else {
      return res
        .status(200)
        .json({ available: true, message: "Album name is available" });
    }
  } catch (error) {
    console.log("Error in checking album title: ", error);
    return res
      .status(500)
      .json({ code: "SERVER_ERROR", message: "Error in checking album title" });
  }
};

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
  albumTitleExist,
};
