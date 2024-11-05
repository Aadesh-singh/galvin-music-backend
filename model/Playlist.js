const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hashtags: [{ type: String }],
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    songs: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
