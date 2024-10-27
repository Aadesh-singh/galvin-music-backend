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
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);