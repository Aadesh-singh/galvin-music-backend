const express = require("express");
const multer = require("multer");
const { createAlbum, albumTitleExist } = require("../controller/album");
const { authenticateToken } = require("../middleware/auth");
// Configure Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files are stored temporarily

const router = express.Router();

router.post(
  "/create-album",
  authenticateToken,
  upload.single("coverPhoto"),
  createAlbum
);
router.get("/albumTitleExist", albumTitleExist);

module.exports = router;
