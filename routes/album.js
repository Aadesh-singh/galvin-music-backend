const express = require("express");
const { createAlbum, albumTitleExist } = require("../controller/album");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/create-album", authenticateToken, createAlbum);
router.get("/albumTitleExist", albumTitleExist);

module.exports = router;
