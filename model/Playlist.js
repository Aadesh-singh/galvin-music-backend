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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
