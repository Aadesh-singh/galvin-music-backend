const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  createPlaylist,
  playlistTitleExist,
} = require("../controller/playlist");

const router = express.Router();

router.post("/create-playlist", authenticateToken, createPlaylist);
router.get("/playlistTitleExist", playlistTitleExist);

module.exports = router;
