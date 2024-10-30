const express = require("express");
const { createAlbum } = require("../controller/album");

const router = express.Router();

router.post("/create-album", createAlbum);

module.exports = router;
