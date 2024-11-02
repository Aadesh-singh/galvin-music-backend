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
    console.log(albums);
    console.log(albums.length);
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
    const { name, hashtags, description } = req.body;
    const album = await Album.find({ name: name });
    console.log(album);
    if (album.length > 0) {
      return res.status(403).json({
        code: "Bad payload",
        message: "Album with same name already exist",
      });
    }
    await Album.create({
      name: name,
      hashtags: hashtags,
      description: description,
    });
    return res.status(200).json({ message: "Album created successfully" });
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
