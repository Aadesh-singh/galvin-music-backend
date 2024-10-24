const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadSong } = require("../controller/song");

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files are stored temporarily

router.post("/upload-song", upload.single("song"), uploadSong);

module.exports = router;
