const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadSong, getAllSongs } = require("../controller/song");
const { authenticateToken } = require("../middleware/auth");

// Configure Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files are stored temporarily

router.post(
  "/upload-song",
  authenticateToken,
  upload.fields([
    { name: "song", maxCount: 1 }, // Single song file
    { name: "coverPhoto", maxCount: 1 }, // Single cover photo file
  ]),
  uploadSong
);

router.get("/getAllSongs", getAllSongs);

module.exports = router;
