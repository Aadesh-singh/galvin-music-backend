const Playlist = require("../model/Playlist");
const User = require("../model/user");

const createPlaylist = async (req, res) => {
  try {
    const { name, hashtags, description } = req.body;
    const playlist = await Playlist.find({ name: name });
    console.log(playlist);
    if (playlist.length > 0) {
      return res.status(403).json({
        code: "Bad payload",
        message: "Playlist with same name already exist",
      });
    }
    const playlistCreated = await Playlist.create({
      name: name,
      hashtags: hashtags,
      description: description,
      owner: req.user.id,
      users: [req.user.id],
    });

    await User.updateOne(
      { _id: req.user.id },
      { $push: { playlists: playlistCreated._id } }
    );

    return res.status(200).json({ message: "Playlist created successfully" });
  } catch (error) {
    console.log("Error in creating Playlist: ", error);
    return res
      .status(500)
      .json({ code: "SERVER_ERROR", message: "Error in creating Playlist" });
  }
};

const playlistTitleExist = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res
        .status(401)
        .json({ code: "BAD_PAYLOAD", message: "Please send a valid payload" });
    }
    const playlists = await Playlist.find({
      name: { $regex: `^${title}$`, $options: "i" },
    });
    console.log(title, playlists);
    console.log(title, playlists.length);
    if (playlists.length > 0) {
      return res
        .status(200)
        .json({ available: false, message: "Playlist name Already Exist" });
    } else {
      return res
        .status(200)
        .json({ available: true, message: "Playlist Name is Available" });
    }
  } catch (error) {
    console.log("Error in checking Playlist title: ", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Error in Checking Playlist title",
    });
  }
};

const getAllPlaylist = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const allPlaylist = await Playlist.find({})
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    return res.status(200).json({
      status: 200,
      message: "All Playlists Fetched Successfully",
      playlists: allPlaylist,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      status: 500,
      message: "Error in Fetching All Playlist",
      error: error?.message,
    });
  }
};

const getAllPlaylistOfUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ status: 403, message: "Bad Payload" });
    }
    const user = await User.find({ _id: userId });
    if (!user) {
      return res
        .status(401)
        .json({ status: 401, message: "UnAuthorized Request" });
    }
    const allPlaylist = await Playlist.find({ users: { $in: [userId] } })
      .populate("owner", "firstName lastName")
      .sort({
        createdAt: -1,
      });
    return res.status(200).json({
      status: 200,
      message: "All Playlists Fetched Successfully",
      playlists: allPlaylist,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      status: 500,
      message: "Error in Fetching All Playlist",
      error: error?.message,
    });
  }
};

module.exports = {
  createPlaylist,
  playlistTitleExist,
  getAllPlaylist,
  getAllPlaylistOfUser,
};
