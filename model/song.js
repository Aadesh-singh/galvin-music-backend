const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lyricsby: {
      type: [String],
    },
    musicby: {
      type: [String],
    },
    singers: {
      type: [String],
      required: true,
    },
    lyrics: {
      type: String,
    },
    miscInfo: {
      type: String,
    },
    songUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "song",
    },
    coverPhotoUrl: { type: String },
    songKey: { type: String },
    coverKey: { type: String },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playlists: [{ type: mongoose.Types.ObjectId, ref: "Playlist" }],
    albums: [{ type: mongoose.Types.ObjectId, ref: "Album" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
