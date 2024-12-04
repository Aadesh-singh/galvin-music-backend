const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      // required: true,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileUrl: {
      type: String,
    },
    isArtist: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      default: "default", //default for email and password
    },
    profileUrl: { type: String },
    playlists: [{ type: mongoose.Types.ObjectId, ref: "Playlist" }],
    albums: [{ type: mongoose.Types.ObjectId, ref: "Album" }],
    favSongs: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
