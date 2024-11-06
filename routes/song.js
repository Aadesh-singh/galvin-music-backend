const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadSong } = require("../controller/song");

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files are stored temporarily

router.post(
  "/upload-song",
  upload.fields([
    { name: "song", maxCount: 1 }, // Single song file
    { name: "coverPhoto", maxCount: 1 }, // Single cover photo file
  ]),
  uploadSong
);

module.exports = router;
