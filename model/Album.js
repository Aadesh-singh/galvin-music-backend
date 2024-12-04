const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema(
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
    type: {
      type: String,
      default: "album",
    },
    coverPhotoUrl: { type: String },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    songs: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", AlbumSchema);
