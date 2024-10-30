const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { createPlaylist } = require("../controller/playlist");

const router = express.Router();

router.post("/create-playlist", authenticateToken, createPlaylist);

module.exports = router;
