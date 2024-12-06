const User = require("../model/user");

const getAllArtists = async (req, res) => {
  try {
    let { page, limit } = req.query;
    if (!page) page = 0;
    if (!limit) limit = 10;
    const artists = await User.find({ isArtist: true })
      .skip(page * limit)
      .limit(limit); //Now only fetcing but need way to sort based on popularity.
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

// Additional fiuntion to run query
// const misc = async () => {
//   const mongoDB = await User.updateMany({}, { isArtist: true });
//   console.log("done ", mongoDB);
// };
// misc();

module.exports = {
  getAllArtists,
};
