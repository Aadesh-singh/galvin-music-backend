const User = require("../model/user");

const getAllArtists = async (req, res) => {
  try {
    const artists = await User.find({ isArtist: true }); //Now only fetcing but need way to sort based on popularity.
    return res.status(200).json({
      status: 200,
      message: "All Artists fetched successfully",
      artists,
    });
  } catch (error) {
    console.log("Error in getting all artists", error);
    return res.status(500).json({
      status: 500,
      message: "Error in Fetching All Artists",
      error: error?.message,
    });
  }
};

module.exports = {
  getAllArtists,
};
