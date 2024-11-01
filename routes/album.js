const express = require("express");
const { createAlbum, albumTitleExist } = require("../controller/album");

const router = express.Router();

router.post("/create-album", createAlbum);
router.get("/albumTitleExist", albumTitleExist);

module.exports = router;
