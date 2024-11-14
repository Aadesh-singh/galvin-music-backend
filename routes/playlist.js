const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  createPlaylist,
  playlistTitleExist,
  getAllPlaylist,
  getAllPlaylistOfUser,
} = require("../controller/playlist");

const router = express.Router();

router.post("/create-playlist", authenticateToken, createPlaylist);
router.get("/playlistTitleExist", playlistTitleExist);
router.get("/getAllPlaylist", getAllPlaylist);
router.get("/getAllPlaylistOfUser", authenticateToken, getAllPlaylistOfUser);

module.exports = router;
