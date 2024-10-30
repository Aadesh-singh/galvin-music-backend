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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", AlbumSchema);
