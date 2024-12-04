const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { getAllArtists } = require("../controller/artists");

const router = express.Router();

router.get("/getAllArtists", getAllArtists);
module.exports = router;
